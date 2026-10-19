import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Inquiry
from ..schemas import InquiryCreate, InquiryOut
from ..utils.audit_helper import log_audit_event

router = APIRouter(prefix="/api/inquiries", tags=["Inquiries & Demonstrations"])

@router.post("", response_model=InquiryOut, status_code=201)
def submit_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)):
    if not payload.consent_given:
        raise HTTPException(
            status_code=400,
            detail="You must acknowledge the data privacy notice and consent to proceed."
        )

    year = datetime.date.today().year
    count = db.query(Inquiry).count() + 1
    ref = f"INQ-{year}-{count:04d}"

    inq = Inquiry(
        inquiry_ref=ref,
        name=payload.name,
        official_designation=payload.official_designation,
        department=payload.department,
        official_email=payload.official_email,
        area_of_interest=payload.area_of_interest,
        message=payload.message,
        consent_given=payload.consent_given,
        status="RECEIVED"
    )
    db.add(inq)
    db.commit()
    db.refresh(inq)

    log_audit_event(
        db=db,
        actor_name=payload.name,
        actor_role="External Official",
        action_type="INQUIRY_SUBMISSION",
        target_entity="INQUIRY",
        target_id=inq.inquiry_ref,
        details={
            "department": payload.department,
            "designation": payload.official_designation,
            "area_of_interest": payload.area_of_interest
        }
    )

    return inq

@router.get("", response_model=List[InquiryOut])
def get_inquiries(db: Session = Depends(get_db)):
    return db.query(Inquiry).order_by(Inquiry.created_at.desc()).all()
