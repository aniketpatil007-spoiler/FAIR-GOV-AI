from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Employee, Document, CorrectionRequest, VacancyNotice, PromotionApplication, AuditEvent
from ..schemas import DashboardStats

router = APIRouter(prefix="/api/stats", tags=["Dashboard Statistics"])

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_emp = db.query(Employee).count()
    awaiting_docs = db.query(Document).filter(
        Document.verification_status.in_(["SUBMITTED", "UNDER_VERIFICATION"])
    ).count()
    open_corrections = db.query(CorrectionRequest).filter(
        CorrectionRequest.status == "PENDING"
    ).count()
    active_vacancies = db.query(VacancyNotice).filter(
        VacancyNotice.status == "PUBLISHED"
    ).count()
    awaiting_apps = db.query(PromotionApplication).filter(
        PromotionApplication.status == "SUBMITTED"
    ).count()
    completed_apps = db.query(PromotionApplication).filter(
        PromotionApplication.status.in_(["ELIGIBLE", "INELIGIBLE", "ALLOCATED"])
    ).count()
    flagged_risks = db.query(AuditEvent).filter(
        AuditEvent.is_flagged_risk == True
    ).count()
    total_audits = db.query(AuditEvent).count()

    return DashboardStats(
        total_demo_employees=total_emp,
        documents_awaiting_verification=awaiting_docs,
        open_correction_requests=open_corrections,
        active_vacancies=active_vacancies,
        applications_awaiting_assessment=awaiting_apps,
        completed_workflows=completed_apps,
        flagged_audit_risks=flagged_risks,
        total_audit_events=total_audits,
        disclaimer="Demonstration environment with synthetic data. Not connected to production government registries."
    )
