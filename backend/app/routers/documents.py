import os
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Document, Employee
from ..schemas import DocumentOut, DocumentVerifyAction
from ..utils.hasher import calculate_sha256_bytes
from ..utils.audit_helper import log_audit_event
from ..config import UPLOAD_DIR

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentOut])
def get_documents(
    employee_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if employee_id:
        query = query.filter(Document.employee_id == employee_id)
    if status:
        query = query.filter(Document.verification_status == status.upper())
    return query.order_by(Document.created_at.desc()).all()

@router.get("/{document_id}", response_model=DocumentOut)
def get_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.post("/upload", response_model=DocumentOut, status_code=201)
async def upload_document(
    employee_id: int = Form(...),
    doc_type: str = Form(...),
    document_name: str = Form(...),
    file: UploadFile = File(...),
    actor_name: str = Form("Employee / Nodal Assistant"),
    actor_role: str = Form("Employee"),
    db: Session = Depends(get_db)
):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Read bytes and compute cryptographic SHA-256
    file_bytes = await file.read()
    file_size = len(file_bytes)
    if file_size > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds maximum allowed limit of 15MB.")

    sha256_hash = calculate_sha256_bytes(file_bytes)

    # Check for identical duplicate file hashes across the entire repository
    duplicate_match = db.query(Document).filter(Document.file_sha256 == sha256_hash).first()
    is_duplicate = duplicate_match is not None

    # Save to disk
    safe_filename = f"{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    disk_path = UPLOAD_DIR / safe_filename
    with open(disk_path, "wb") as f:
        f.write(file_bytes)

    doc = Document(
        employee_id=employee_id,
        document_name=document_name or file.filename,
        doc_type=doc_type.upper(),
        file_path=str(disk_path),
        file_size=file_size,
        mime_type=file.content_type or "application/octet-stream",
        file_sha256=sha256_hash,
        is_duplicate_flag=is_duplicate,
        verification_status="SUBMITTED",
        created_at=datetime.datetime.utcnow()
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    log_audit_event(
        db=db,
        actor_name=actor_name,
        actor_role=actor_role,
        action_type="UPLOAD",
        target_entity="DOCUMENT",
        target_id=str(doc.id),
        details={
            "document_name": doc.document_name,
            "doc_type": doc.doc_type,
            "sha256": doc.file_sha256,
            "duplicate_hash_detected": is_duplicate,
            "matched_existing_doc_id": duplicate_match.id if duplicate_match else None
        },
        force_risk_flag=is_duplicate,
        risk_reason="Uploaded document has identical SHA-256 hash to a previously submitted file." if is_duplicate else None
    )

    return doc

@router.post("/{document_id}/verify", response_model=DocumentOut)
def verify_document(
    document_id: int,
    payload: DocumentVerifyAction,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    action_map = {
        "VERIFY": "VERIFIED",
        "DISPUTE": "DISPUTED",
        "REJECT": "REJECTED",
        "UNDER_VERIFICATION": "UNDER_VERIFICATION"
    }
    new_status = action_map.get(payload.action.upper())
    if not new_status:
        raise HTTPException(status_code=400, detail="Invalid verification action.")

    old_status = doc.verification_status
    doc.verification_status = new_status
    doc.verifier_name = payload.verifier_name
    doc.verifier_role = payload.verifier_role
    doc.verifier_notes = payload.reason
    doc.verified_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(doc)

    is_risk = (new_status in ["DISPUTED", "REJECTED"])
    log_audit_event(
        db=db,
        actor_name=payload.verifier_name,
        actor_role=payload.verifier_role,
        action_type="VERIFY",
        target_entity="DOCUMENT",
        target_id=str(doc.id),
        details={
            "previous_status": old_status,
            "new_status": new_status,
            "reason": payload.reason,
            "doc_name": doc.document_name
        },
        force_risk_flag=is_risk,
        risk_reason=f"Document status marked as {new_status}: {payload.reason}" if is_risk else None
    )

    return doc
