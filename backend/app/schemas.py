from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import date, datetime

# Employee Schemas
class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    designation: str
    cadre: str
    joining_date: date
    dob: date
    category: str = "UR"
    pay_level: int = 8
    apar_scores: Dict[str, Any] = Field(default_factory=dict)
    vigilance_status: str = "CLEAR"
    service_status: str = "ACTIVE"

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    department: Optional[str] = None
    designation: Optional[str] = None
    cadre: Optional[str] = None
    pay_level: Optional[int] = None
    apar_scores: Optional[Dict[str, Any]] = None
    vigilance_status: Optional[str] = None
    service_status: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: int
    employee_ref: str
    identity_hash: Optional[str] = None
    record_version: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Document Schemas
class DocumentOut(BaseModel):
    id: int
    employee_id: int
    document_name: str
    doc_type: str
    file_path: str
    file_size: int
    mime_type: str
    file_sha256: str
    is_duplicate_flag: bool
    verification_status: str
    verifier_name: Optional[str] = None
    verifier_role: Optional[str] = None
    verifier_notes: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DocumentVerifyAction(BaseModel):
    action: str  # VERIFY, DISPUTE, REJECT
    verifier_name: str
    verifier_role: str = "Document Verifier"
    reason: str

# Correction Request Schemas
class CorrectionRequestCreate(BaseModel):
    employee_id: int
    field_name: str
    current_value: str
    requested_value: str
    reason: str

class CorrectionRequestReview(BaseModel):
    decision: str  # APPROVED, REJECTED
    reviewed_by: str
    review_notes: str

class CorrectionRequestOut(BaseModel):
    id: int
    employee_id: int
    field_name: str
    current_value: str
    requested_value: str
    reason: str
    status: str
    reviewed_by: Optional[str] = None
    review_notes: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Vacancy Schemas
class VacancyCreate(BaseModel):
    title: str
    target_cadre: str
    target_designation: str
    target_pay_level: int
    feeder_designation: str
    total_vacancies: int
    breakdown_ur: int = 0
    breakdown_sc: int = 0
    breakdown_st: int = 0
    breakdown_obc: int = 0
    breakdown_ews: int = 0
    breakdown_pwbd: int = 0
    vacancy_causes: Dict[str, int] = Field(default_factory=dict)
    sanctioned_reconciliation: Optional[str] = None
    application_deadline: Optional[date] = None

class VacancyUpdate(BaseModel):
    title: Optional[str] = None
    total_vacancies: Optional[int] = None
    status: Optional[str] = None
    application_deadline: Optional[date] = None
    revision_reason: Optional[str] = None

class VacancyOut(BaseModel):
    id: int
    notice_code: str
    title: str
    target_cadre: str
    target_designation: str
    target_pay_level: int
    feeder_designation: str
    total_vacancies: int
    breakdown_ur: int
    breakdown_sc: int
    breakdown_st: int
    breakdown_obc: int
    breakdown_ews: int
    breakdown_pwbd: int
    vacancy_causes: Dict[str, Any]
    sanctioned_reconciliation: Optional[str] = None
    status: str
    published_date: Optional[date] = None
    application_deadline: Optional[date] = None
    created_by: str
    revision_count: int
    revision_notes: List[Any] = Field(default_factory=list)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Promotion RuleSet Schemas
class RuleSetOut(BaseModel):
    id: int
    rule_code: str
    title: str
    official_reference: str
    effective_date: date
    version: str
    feeder_designation: str
    target_designation: str
    min_years_qualifying_service: float
    apar_benchmark: float
    require_vigilance_clearance: bool
    seniority_weight: float
    merit_apar_weight: float
    tie_breaker_hierarchy: List[str]
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Promotion Application Schemas
class ApplicationCreate(BaseModel):
    vacancy_notice_id: int
    employee_id: int

class ApplicationOut(BaseModel):
    id: int
    application_number: str
    vacancy_notice_id: int
    employee_id: int
    status: str
    receipt_hash: str
    service_years_calculated: float
    merit_score: float
    seniority_score: float
    composite_score: float
    provisional_rank: Optional[int] = None
    is_allocated: bool
    allocated_quota: Optional[str] = None
    evaluation_result: Dict[str, Any] = Field(default_factory=dict)
    committee_remarks: Optional[str] = None
    submitted_at: datetime
    evaluated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Appeal Schemas
class AppealCreate(BaseModel):
    application_id: int
    employee_id: int
    grievance_type: str
    description: str
    supporting_doc_ref: Optional[str] = None

class AppealReview(BaseModel):
    decision: str  # ALLOWED, DISMISSED
    speaking_order: str
    disposal_order_number: str
    resolved_by: str

class AppealOut(BaseModel):
    id: int
    appeal_number: str
    application_id: int
    employee_id: int
    grievance_type: str
    description: str
    supporting_doc_ref: Optional[str] = None
    status: str
    disposal_order_number: Optional[str] = None
    speaking_order: Optional[str] = None
    resolved_by: Optional[str] = None
    filed_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Audit Event Schemas
class AuditEventOut(BaseModel):
    id: int
    timestamp: datetime
    actor_name: str
    actor_role: str
    action_type: str
    target_entity: str
    target_id: str
    details: Dict[str, Any]
    ip_address: str
    is_flagged_risk: bool
    risk_reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Inquiry Schemas
class InquiryCreate(BaseModel):
    name: str
    official_designation: str
    department: str
    official_email: EmailStr
    area_of_interest: str
    message: Optional[str] = None
    consent_given: bool

class InquiryOut(BaseModel):
    id: int
    inquiry_ref: str
    name: str
    official_designation: str
    department: str
    official_email: str
    area_of_interest: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Stats
class DashboardStats(BaseModel):
    total_demo_employees: int
    documents_awaiting_verification: int
    open_correction_requests: int
    active_vacancies: int
    applications_awaiting_assessment: int
    completed_workflows: int
    flagged_audit_risks: int
    total_audit_events: int
    disclaimer: str = "Demonstration environment with synthetic data. Not connected to production government registries."

