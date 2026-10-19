from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import AuditEvent
from ..schemas import AuditEventOut

router = APIRouter(prefix="/api/audit", tags=["Audit Trails"])

@router.get("", response_model=List[AuditEventOut])
def get_audit_trail(
    target_entity: Optional[str] = None,
    actor_role: Optional[str] = None,
    risk_only: Optional[bool] = False,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(AuditEvent)
    if target_entity:
        query = query.filter(AuditEvent.target_entity == target_entity.upper())
    if actor_role:
        query = query.filter(AuditEvent.actor_role == actor_role)
    if risk_only:
        query = query.filter(AuditEvent.is_flagged_risk == True)

    return query.order_by(AuditEvent.timestamp.desc()).limit(limit).all()
