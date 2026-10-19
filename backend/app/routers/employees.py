from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime

from ..database import get_db
from ..models import Employee, CorrectionRequest, AuditEvent
from ..schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeOut,
    CorrectionRequestCreate, CorrectionRequestReview, CorrectionRequestOut
)
from ..utils.hasher import generate_identity_hash
from ..utils.audit_helper import log_audit_event

router = APIRouter(prefix="/api/employees", tags=["Employees"])

@router.get("", response_model=List[EmployeeOut])
def get_employees(
    department: Optional[str] = None,
    designation: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Employee)
    if department:
        query = query.filter(Employee.department.ilike(f"%{department}%"))
    if designation:
        query = query.filter(Employee.designation.ilike(f"%{designation}%"))
    if category:
        query = query.filter(Employee.category == category.upper())
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Employee.full_name.ilike(search_filter)) |
            (Employee.employee_ref.ilike(search_filter)) |
            (Employee.email.ilike(search_filter))
        )
    return query.order_by(Employee.joining_date.asc()).all()

@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.post("", response_model=EmployeeOut, status_code=201)
def create_employee(
    payload: EmployeeCreate,
    actor_name: str = Query("Admin", description="Name of acting user"),
    actor_role: str = Query("HR Officer", description="Role of acting user"),
    db: Session = Depends(get_db)
):
    # Check duplicate email
    if db.query(Employee).filter(Employee.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Employee with this official email already exists.")

    ident_hash = generate_identity_hash(payload.full_name, payload.dob.isoformat(), payload.department)
    duplicate_match = db.query(Employee).filter(Employee.identity_hash == ident_hash).first()

    # Generate employee reference ID
    year = payload.joining_date.year
    count = db.query(Employee).count() + 1
    ref = f"GOV-CADRE-{year}-{count:04d}"

    emp = Employee(
        **payload.dict(),
        employee_ref=ref,
        identity_hash=ident_hash,
        record_version=1
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)

    # Log audit event
    log_audit_event(
        db=db,
        actor_name=actor_name,
        actor_role=actor_role,
        action_type="CREATE",
        target_entity="EMPLOYEE",
        target_id=emp.employee_ref,
        details={
            "full_name": emp.full_name,
            "department": emp.department,
            "designation": emp.designation,
            "possible_duplicate_flag": duplicate_match is not None,
            "matched_existing_ref": duplicate_match.employee_ref if duplicate_match else None
        },
        force_risk_flag=duplicate_match is not None,
        risk_reason="Potential duplicate employee record identity detected." if duplicate_match else None
    )

    return emp

@router.put("/{employee_id}", response_model=EmployeeOut)
def update_employee(
    employee_id: int,
    payload: EmployeeUpdate,
    actor_name: str = Query("HR Officer"),
    actor_role: str = Query("HR Officer"),
    justification: str = Query("Routine administrative service record update"),
    db: Session = Depends(get_db)
):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    changes = {}
    for key, value in payload.dict(exclude_unset=True).items():
        if value is not None and getattr(emp, key) != value:
            changes[key] = {"old": getattr(emp, key), "new": value}
            setattr(emp, key, value)

    if changes:
        emp.record_version += 1
        emp.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(emp)

        log_audit_event(
            db=db,
            actor_name=actor_name,
            actor_role=actor_role,
            action_type="UPDATE",
            target_entity="EMPLOYEE",
            target_id=emp.employee_ref,
            details={"changes": changes, "justification": justification}
        )

    return emp

@router.post("/{employee_id}/corrections", response_model=CorrectionRequestOut, status_code=201)
def request_correction(
    employee_id: int,
    payload: CorrectionRequestCreate,
    db: Session = Depends(get_db)
):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    corr = CorrectionRequest(
        employee_id=employee_id,
        field_name=payload.field_name,
        current_value=payload.current_value,
        requested_value=payload.requested_value,
        reason=payload.reason,
        status="PENDING"
    )
    db.add(corr)
    db.commit()
    db.refresh(corr)

    log_audit_event(
        db=db,
        actor_name=emp.full_name,
        actor_role="Employee",
        action_type="CORRECTION_REQUEST",
        target_entity="EMPLOYEE",
        target_id=emp.employee_ref,
        details={
            "field": payload.field_name,
            "requested_value": payload.requested_value,
            "reason": payload.reason
        }
    )

    return corr

@router.get("/corrections/list", response_model=List[CorrectionRequestOut])
def get_corrections(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CorrectionRequest)
    if status:
        query = query.filter(CorrectionRequest.status == status.upper())
    return query.order_by(CorrectionRequest.created_at.desc()).all()

@router.put("/corrections/{correction_id}/review", response_model=CorrectionRequestOut)
def review_correction(
    correction_id: int,
    payload: CorrectionRequestReview,
    db: Session = Depends(get_db)
):
    corr = db.query(CorrectionRequest).filter(CorrectionRequest.id == correction_id).first()
    if not corr:
        raise HTTPException(status_code=404, detail="Correction request not found")

    corr.status = payload.decision.upper()
    corr.reviewed_by = payload.reviewed_by
    corr.review_notes = payload.review_notes
    corr.reviewed_at = datetime.datetime.utcnow()

    # If approved, update the employee record
    if corr.status == "APPROVED":
        emp = db.query(Employee).filter(Employee.id == corr.employee_id).first()
        if emp and hasattr(emp, corr.field_name):
            setattr(emp, corr.field_name, corr.requested_value)
            emp.record_version += 1

    db.commit()
    db.refresh(corr)

    log_audit_event(
        db=db,
        actor_name=payload.reviewed_by,
        actor_role="Establishment Reviewer",
        action_type="CORRECTION_REVIEW",
        target_entity="EMPLOYEE",
        target_id=str(corr.employee_id),
        details={
            "decision": corr.status,
            "field": corr.field_name,
            "notes": corr.review_notes
        }
    )

    return corr
