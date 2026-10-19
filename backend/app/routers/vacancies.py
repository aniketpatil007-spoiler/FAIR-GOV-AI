import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import VacancyNotice
from ..schemas import VacancyCreate, VacancyUpdate, VacancyOut
from ..utils.audit_helper import log_audit_event

router = APIRouter(prefix="/api/vacancies", tags=["Vacancies"])

@router.get("", response_model=List[VacancyOut])
def get_vacancies(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(VacancyNotice)
    if status:
        query = query.filter(VacancyNotice.status == status.upper())
    return query.order_by(VacancyNotice.created_at.desc()).all()

@router.get("/{vacancy_id}", response_model=VacancyOut)
def get_vacancy(vacancy_id: int, db: Session = Depends(get_db)):
    v = db.query(VacancyNotice).filter(VacancyNotice.id == vacancy_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vacancy notice not found")
    return v

@router.post("", response_model=VacancyOut, status_code=201)
def create_vacancy(
    payload: VacancyCreate,
    actor_name: str = Query("Establishment Officer"),
    actor_role: str = Query("HR Officer"),
    db: Session = Depends(get_db)
):
    year = datetime.date.today().year
    count = db.query(VacancyNotice).count() + 1
    code = f"VAC-{year}-CADRE-{count:03d}"

    v = VacancyNotice(
        notice_code=code,
        title=payload.title,
        target_cadre=payload.target_cadre,
        target_designation=payload.target_designation,
        target_pay_level=payload.target_pay_level,
        feeder_designation=payload.feeder_designation,
        total_vacancies=payload.total_vacancies,
        breakdown_ur=payload.breakdown_ur,
        breakdown_sc=payload.breakdown_sc,
        breakdown_st=payload.breakdown_st,
        breakdown_obc=payload.breakdown_obc,
        breakdown_ews=payload.breakdown_ews,
        breakdown_pwbd=payload.breakdown_pwbd,
        vacancy_causes=payload.vacancy_causes,
        sanctioned_reconciliation=payload.sanctioned_reconciliation,
        status="DRAFT",
        application_deadline=payload.application_deadline,
        created_by=f"{actor_name} ({actor_role})",
        revision_count=1,
        revision_notes=[{
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "note": "Draft vacancy notice created."
        }]
    )
    db.add(v)
    db.commit()
    db.refresh(v)

    log_audit_event(
        db=db,
        actor_name=actor_name,
        actor_role=actor_role,
        action_type="CREATE",
        target_entity="VACANCY",
        target_id=v.notice_code,
        details={
            "title": v.title,
            "total_vacancies": v.total_vacancies,
            "causes": v.vacancy_causes
        }
    )

    return v

@router.put("/{vacancy_id}", response_model=VacancyOut)
def update_vacancy(
    vacancy_id: int,
    payload: VacancyUpdate,
    actor_name: str = Query("Establishment Officer"),
    actor_role: str = Query("HR Officer"),
    db: Session = Depends(get_db)
):
    v = db.query(VacancyNotice).filter(VacancyNotice.id == vacancy_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vacancy notice not found")

    changes = {}
    was_published = (v.status == "PUBLISHED")

    if payload.title is not None and payload.title != v.title:
        changes["title"] = {"old": v.title, "new": payload.title}
        v.title = payload.title

    if payload.total_vacancies is not None and payload.total_vacancies != v.total_vacancies:
        changes["total_vacancies"] = {"old": v.total_vacancies, "new": payload.total_vacancies}
        v.total_vacancies = payload.total_vacancies

    if payload.status is not None and payload.status.upper() != v.status:
        changes["status"] = {"old": v.status, "new": payload.status.upper()}
        v.status = payload.status.upper()
        if v.status == "PUBLISHED" and not v.published_date:
            v.published_date = datetime.date.today()

    if payload.application_deadline is not None:
        v.application_deadline = payload.application_deadline

    if changes:
        v.revision_count += 1
        note_text = payload.revision_reason or f"Revised by {actor_name}. Changes: {list(changes.keys())}"
        current_notes = list(v.revision_notes or [])
        current_notes.append({
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "actor": f"{actor_name} ({actor_role})",
            "note": note_text,
            "changes": changes
        })
        v.revision_notes = current_notes

        db.commit()
        db.refresh(v)

        # Sensitive modification check: If total_vacancies changed after publication, flag risk
        sensitive_post_pub = was_published and "total_vacancies" in changes
        log_audit_event(
            db=db,
            actor_name=actor_name,
            actor_role=actor_role,
            action_type="UPDATE",
            target_entity="VACANCY",
            target_id=v.notice_code,
            details={"status": v.status, "changes": changes, "reason": payload.revision_reason},
            force_risk_flag=sensitive_post_pub,
            risk_reason="Vacancy count altered on an already published notice. Verification required." if sensitive_post_pub else None
        )

    return v
