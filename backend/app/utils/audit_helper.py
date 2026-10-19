import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models import AuditEvent

def log_audit_event(
    db: Session,
    actor_name: str,
    actor_role: str,
    action_type: str,
    target_entity: str,
    target_id: str,
    details: Dict[str, Any],
    ip_address: str = "127.0.0.1",
    force_risk_flag: bool = False,
    risk_reason: Optional[str] = None
) -> AuditEvent:
    """
    Logs an immutable-style audit trail event.
    Evaluates rule heuristics to detect potential integrity risks or anomalies.
    """
    is_risk = force_risk_flag
    reason = risk_reason

    # Heuristic 1: If action is changing vacancy counts after publication
    if target_entity == "VACANCY" and action_type == "UPDATE" and details.get("status") == "PUBLISHED":
        if "total_vacancies" in details.get("changes", {}):
            is_risk = True
            reason = "Sensitive post-publication modification to vacancy quota."

    # Heuristic 2: If document verification is done with an identical duplicate file hash
    if target_entity == "DOCUMENT" and details.get("duplicate_hash_detected"):
        is_risk = True
        reason = "Document shares identical SHA-256 hash with an existing record."

    # Heuristic 3: Role separation warning - if a system administrator attempts to alter promotion outcomes
    if actor_role == "System Administrator" and action_type in ["EVALUATE", "ALLOCATE", "ALTER_SCORE"]:
        is_risk = True
        reason = "Privileged System Admin attempted direct alteration of promotion outcome (violates separation of duties)."

    event = AuditEvent(
        timestamp=datetime.datetime.utcnow(),
        actor_name=actor_name,
        actor_role=actor_role,
        action_type=action_type,
        target_entity=target_entity,
        target_id=str(target_id),
        details=details,
        ip_address=ip_address,
        is_flagged_risk=is_risk,
        risk_reason=reason
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
