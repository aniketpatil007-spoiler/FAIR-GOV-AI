import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import (
    PromotionApplication, PromotionRuleSet, VacancyNotice, Employee,
    Appeal, AuditEvent
)
from ..schemas import (
    ApplicationCreate, ApplicationOut, RuleSetOut,
    AppealCreate, AppealReview, AppealOut
)
from ..rules_engine import evaluate_candidate_eligibility, rank_and_allocate_applications
from ..utils.hasher import generate_receipt_hash
from ..utils.audit_helper import log_audit_event

router = APIRouter(prefix="/api/promotions", tags=["Promotions & Rules"])

@router.get("/rulesets", response_model=List[RuleSetOut])
def get_rulesets(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PromotionRuleSet)
    if status:
        query = query.filter(PromotionRuleSet.status == status.upper())
    return query.order_by(PromotionRuleSet.effective_date.desc()).all()

@router.get("/rulesets/{ruleset_id}", response_model=RuleSetOut)
def get_ruleset(ruleset_id: int, db: Session = Depends(get_db)):
    r = db.query(PromotionRuleSet).filter(PromotionRuleSet.id == ruleset_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Promotion rule set not found")
    return r

@router.get("/applications", response_model=List[ApplicationOut])
def get_applications(
    vacancy_id: Optional[int] = None,
    employee_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PromotionApplication)
    if vacancy_id:
        query = query.filter(PromotionApplication.vacancy_notice_id == vacancy_id)
    if employee_id:
        query = query.filter(PromotionApplication.employee_id == employee_id)
    if status:
        query = query.filter(PromotionApplication.status == status.upper())
    return query.order_by(PromotionApplication.provisional_rank.asc().nullslast(), PromotionApplication.submitted_at.asc()).all()

@router.get("/applications/{application_id}", response_model=ApplicationOut)
def get_application(application_id: int, db: Session = Depends(get_db)):
    app = db.query(PromotionApplication).filter(PromotionApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Promotion application not found")
    return app

@router.post("/applications", response_model=ApplicationOut, status_code=201)
def submit_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db)
):
    emp = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    vac = db.query(VacancyNotice).filter(VacancyNotice.id == payload.vacancy_notice_id).first()
    if not vac:
        raise HTTPException(status_code=404, detail="Vacancy notice not found")

    if vac.status != "PUBLISHED":
        raise HTTPException(status_code=400, detail="Cannot apply to a vacancy notice that is not published.")

    # Check for existing application
    existing = db.query(PromotionApplication).filter(
        PromotionApplication.vacancy_notice_id == payload.vacancy_notice_id,
        PromotionApplication.employee_id == payload.employee_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employee has already submitted an application for this vacancy.")

    count = db.query(PromotionApplication).count() + 1
    app_num = f"APP-{datetime.date.today().year}-{vac.target_designation[:2].upper()}-{count:04d}"
    receipt = generate_receipt_hash(app_num, emp.employee_ref, datetime.datetime.utcnow().isoformat())

    app = PromotionApplication(
        application_number=app_num,
        vacancy_notice_id=vac.id,
        employee_id=emp.id,
        status="SUBMITTED",
        receipt_hash=receipt,
        submitted_at=datetime.datetime.utcnow()
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    log_audit_event(
        db=db,
        actor_name=emp.full_name,
        actor_role="Employee",
        action_type="SUBMIT_APPLICATION",
        target_entity="APPLICATION",
        target_id=app.application_number,
        details={
            "vacancy_code": vac.notice_code,
            "receipt_hash": receipt
        }
    )

    return app

@router.post("/applications/evaluate/{vacancy_id}")
def evaluate_vacancy_applications(
    vacancy_id: int,
    ruleset_id: Optional[int] = None,
    actor_name: str = Query("Promotion Committee Member"),
    actor_role: str = Query("Promotion Committee"),
    db: Session = Depends(get_db)
):
    """
    Executes the transparent eligibility evaluation and ranking engine across all
    applications submitted against the specified vacancy notice.
    """
    vac = db.query(VacancyNotice).filter(VacancyNotice.id == vacancy_id).first()
    if not vac:
        raise HTTPException(status_code=404, detail="Vacancy notice not found")

    # Select ruleset
    if ruleset_id:
        ruleset = db.query(PromotionRuleSet).filter(PromotionRuleSet.id == ruleset_id).first()
    else:
        ruleset = db.query(PromotionRuleSet).filter(
            PromotionRuleSet.target_designation.ilike(f"%{vac.target_designation}%"),
            PromotionRuleSet.status == "ACTIVE"
        ).first()

    if not ruleset:
        # Fallback to any active ruleset
        ruleset = db.query(PromotionRuleSet).filter(PromotionRuleSet.status == "ACTIVE").first()

    if not ruleset:
        raise HTTPException(status_code=400, detail="No active promotion rule set found for this designation.")

    applications = db.query(PromotionApplication).filter(
        PromotionApplication.vacancy_notice_id == vacancy_id,
        PromotionApplication.status != "WITHDRAWN"
    ).all()

    if not applications:
        raise HTTPException(status_code=400, detail="No applications found for this vacancy notice.")

    eval_date = vac.published_date or datetime.date.today()

    # Step 1: Evaluate eligibility & scores for every candidate
    for app in applications:
        emp = app.employee
        eval_result = evaluate_candidate_eligibility(emp, ruleset, eval_date)

        app.status = eval_result["overall_status"]
        app.service_years_calculated = eval_result["service_years"]
        app.seniority_score = eval_result["seniority_score"]
        app.merit_score = eval_result["merit_score"]
        app.composite_score = eval_result["composite_score"]
        app.evaluation_result = eval_result
        app.evaluated_at = datetime.datetime.utcnow()

    db.commit()

    # Step 2: Rank and allocate vacancies respecting statutory reservation quotas
    allocation_summary = rank_and_allocate_applications(applications, vac)
    db.commit()

    log_audit_event(
        db=db,
        actor_name=actor_name,
        actor_role=actor_role,
        action_type="EVALUATE",
        target_entity="APPLICATION",
        target_id=vac.notice_code,
        details={
            "ruleset_used": ruleset.rule_code,
            "ruleset_reference": ruleset.official_reference,
            "total_evaluated": len(applications),
            "allocated_count": sum(1 for a in allocation_summary if a["is_allocated"]),
            "allocation_summary": allocation_summary
        }
    )

    return {
        "message": f"Successfully evaluated and ranked {len(applications)} candidates.",
        "vacancy_code": vac.notice_code,
        "ruleset_code": ruleset.rule_code,
        "official_reference": ruleset.official_reference,
        "evaluations": allocation_summary
    }

@router.get("/applications/{application_id}/explain")
def explain_application_decision(application_id: int, db: Session = Depends(get_db)):
    """
    Returns step-by-step transparent explanation of candidate's evaluation,
    showing every condition, substituted variables, math formula, and official rule citation.
    """
    app = db.query(PromotionApplication).filter(PromotionApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if not app.evaluation_result:
        raise HTTPException(status_code=400, detail="Application has not been formally evaluated by the rules engine yet.")

    return {
        "application_number": app.application_number,
        "employee_name": app.employee.full_name if app.employee else "N/A",
        "employee_ref": app.employee.employee_ref if app.employee else "N/A",
        "category": app.employee.category if app.employee else "UR",
        "status": app.status,
        "provisional_rank": app.provisional_rank,
        "is_allocated": app.is_allocated,
        "allocated_quota": app.allocated_quota,
        "composite_score": app.composite_score,
        "seniority_score": app.seniority_score,
        "merit_score": app.merit_score,
        "receipt_hash": app.receipt_hash,
        "evaluation_details": app.evaluation_result
    }

@router.post("/appeals", response_model=AppealOut, status_code=201)
def file_appeal(
    payload: AppealCreate,
    db: Session = Depends(get_db)
):
    app = db.query(PromotionApplication).filter(PromotionApplication.id == payload.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    count = db.query(Appeal).count() + 1
    apl_num = f"APL-{datetime.date.today().year}-{count:04d}"

    apl = Appeal(
        appeal_number=apl_num,
        application_id=payload.application_id,
        employee_id=payload.employee_id,
        grievance_type=payload.grievance_type.upper(),
        description=payload.description,
        supporting_doc_ref=payload.supporting_doc_ref,
        status="PENDING_HEARING",
        filed_at=datetime.datetime.utcnow()
    )
    db.add(apl)
    db.commit()
    db.refresh(apl)

    log_audit_event(
        db=db,
        actor_name=app.employee.full_name if app.employee else "Employee",
        actor_role="Employee",
        action_type="APPEAL",
        target_entity="APPEAL",
        target_id=apl.appeal_number,
        details={
            "application_number": app.application_number,
            "grievance_type": apl.grievance_type,
            "description": apl.description
        }
    )

    return apl

@router.get("/appeals", response_model=List[AppealOut])
def get_appeals(
    status: Optional[str] = None,
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Appeal)
    if status:
        query = query.filter(Appeal.status == status.upper())
    if employee_id:
        query = query.filter(Appeal.employee_id == employee_id)
    return query.order_by(Appeal.filed_at.desc()).all()

@router.put("/appeals/{appeal_id}/review", response_model=AppealOut)
def review_appeal(
    appeal_id: int,
    payload: AppealReview,
    db: Session = Depends(get_db)
):
    apl = db.query(Appeal).filter(Appeal.id == appeal_id).first()
    if not apl:
        raise HTTPException(status_code=404, detail="Appeal not found")

    apl.status = payload.decision.upper()
    apl.speaking_order = payload.speaking_order
    apl.disposal_order_number = payload.disposal_order_number
    apl.resolved_by = payload.resolved_by
    apl.resolved_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(apl)

    log_audit_event(
        db=db,
        actor_name=payload.resolved_by,
        actor_role="Promotion Committee",
        action_type="APPEAL_DISPOSAL",
        target_entity="APPEAL",
        target_id=apl.appeal_number,
        details={
            "decision": apl.status,
            "order_no": apl.disposal_order_number,
            "speaking_order": apl.speaking_order
        }
    )

    return apl
