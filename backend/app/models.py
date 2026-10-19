import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_ref = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    department = Column(String(200), nullable=False)
    designation = Column(String(150), nullable=False)
    cadre = Column(String(150), nullable=False)
    joining_date = Column(Date, nullable=False)
    dob = Column(Date, nullable=False)
    category = Column(String(20), default="UR")  # UR, SC, ST, OBC, EWS, PwBD
    pay_level = Column(Integer, default=8)  # 7th CPC Level (e.g. 8, 10, 11)
    apar_scores = Column(JSON, default=dict)  # {"2019-20": 4.5, "2020-21": 4.7, "average": 4.6}
    vigilance_status = Column(String(50), default="CLEAR")  # CLEAR, PENDING_INQUIRY, ADVERSE
    service_status = Column(String(50), default="ACTIVE")  # ACTIVE, DEPUTATION, ON_LEAVE, RETIRED
    identity_hash = Column(String(64), index=True, nullable=True)  # Salted pseudo-ID hash for duplicate detection
    record_version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    documents = relationship("Document", back_populates="employee", cascade="all, delete-orphan")
    applications = relationship("PromotionApplication", back_populates="employee")
    corrections = relationship("CorrectionRequest", back_populates="employee")
    appeals = relationship("Appeal", back_populates="employee")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    document_name = Column(String(200), nullable=False)
    doc_type = Column(String(100), nullable=False)  # SERVICE_BOOK, APAR_DOSSIER, CASTE_CERTIFICATE, INTEGRITY_CERTIFICATE, DEGREE
    file_path = Column(String(300), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_sha256 = Column(String(64), index=True, nullable=False)
    is_duplicate_flag = Column(Boolean, default=False)
    verification_status = Column(String(50), default="SUBMITTED")  # SUBMITTED, UNDER_VERIFICATION, VERIFIED, DISPUTED, REJECTED
    verifier_name = Column(String(150), nullable=True)
    verifier_role = Column(String(100), nullable=True)
    verifier_notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    employee = relationship("Employee", back_populates="documents")


class CorrectionRequest(Base):
    __tablename__ = "correction_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    field_name = Column(String(100), nullable=False)
    current_value = Column(String(255), nullable=False)
    requested_value = Column(String(255), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="PENDING")  # PENDING, APPROVED, REJECTED
    reviewed_by = Column(String(150), nullable=True)
    review_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    employee = relationship("Employee", back_populates="corrections")


class VacancyNotice(Base):
    __tablename__ = "vacancy_notices"

    id = Column(Integer, primary_key=True, index=True)
    notice_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(250), nullable=False)
    target_cadre = Column(String(150), nullable=False)
    target_designation = Column(String(150), nullable=False)
    target_pay_level = Column(Integer, nullable=False)
    feeder_designation = Column(String(150), nullable=False)
    total_vacancies = Column(Integer, nullable=False)
    breakdown_ur = Column(Integer, default=0)
    breakdown_sc = Column(Integer, default=0)
    breakdown_st = Column(Integer, default=0)
    breakdown_obc = Column(Integer, default=0)
    breakdown_ews = Column(Integer, default=0)
    breakdown_pwbd = Column(Integer, default=0)
    vacancy_causes = Column(JSON, default=dict)  # {"retirement": 6, "resignation": 1, "promotion_outflow": 5}
    sanctioned_reconciliation = Column(Text, nullable=True)
    status = Column(String(50), default="DRAFT")  # DRAFT, UNDER_REVIEW, PUBLISHED, CLOSED
    published_date = Column(Date, nullable=True)
    application_deadline = Column(Date, nullable=True)
    created_by = Column(String(150), default="Establishment Section")
    revision_count = Column(Integer, default=1)
    revision_notes = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("PromotionApplication", back_populates="vacancy_notice")


class PromotionRuleSet(Base):
    __tablename__ = "promotion_rulesets"

    id = Column(Integer, primary_key=True, index=True)
    rule_code = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(250), nullable=False)
    official_reference = Column(String(300), nullable=False)
    effective_date = Column(Date, nullable=False)
    version = Column(String(20), default="v1.0")
    feeder_designation = Column(String(150), nullable=False)
    target_designation = Column(String(150), nullable=False)
    min_years_qualifying_service = Column(Float, default=5.0)
    apar_benchmark = Column(Float, default=4.0)  # On 5.0 or 10.0 scale normalized
    require_vigilance_clearance = Column(Boolean, default=True)
    seniority_weight = Column(Float, default=60.0)
    merit_apar_weight = Column(Float, default=40.0)
    tie_breaker_hierarchy = Column(JSON, default=list)  # ["DATE_OF_ENTRY", "DATE_OF_BIRTH", "SENIORITY_ROLL_NO"]
    status = Column(String(50), default="ACTIVE")  # ACTIVE, ARCHIVED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PromotionApplication(Base):
    __tablename__ = "promotion_applications"

    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(60), unique=True, index=True, nullable=False)
    vacancy_notice_id = Column(Integer, ForeignKey("vacancy_notices.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    status = Column(String(50), default="SUBMITTED")  # SUBMITTED, ELIGIBLE, INELIGIBLE, REQUIRES_REVIEW, SHORTLISTED, ALLOCATED, WITHDRAWN
    receipt_hash = Column(String(64), nullable=False)
    service_years_calculated = Column(Float, default=0.0)
    merit_score = Column(Float, default=0.0)
    seniority_score = Column(Float, default=0.0)
    composite_score = Column(Float, default=0.0)
    provisional_rank = Column(Integer, nullable=True)
    is_allocated = Column(Boolean, default=False)
    allocated_quota = Column(String(20), nullable=True)  # UR, SC, ST, etc.
    evaluation_result = Column(JSON, default=dict)  # Complete explainable breakdown
    committee_remarks = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    evaluated_at = Column(DateTime, nullable=True)

    employee = relationship("Employee", back_populates="applications")
    vacancy_notice = relationship("VacancyNotice", back_populates="applications")
    appeals = relationship("Appeal", back_populates="application")


class Appeal(Base):
    __tablename__ = "appeals"

    id = Column(Integer, primary_key=True, index=True)
    appeal_number = Column(String(60), unique=True, index=True, nullable=False)
    application_id = Column(Integer, ForeignKey("promotion_applications.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    grievance_type = Column(String(100), nullable=False)  # SENIORITY_DISPUTE, APAR_ASSESSMENT, SERVICE_CALCULATION, DOCUMENT_VERIFICATION
    description = Column(Text, nullable=False)
    supporting_doc_ref = Column(String(200), nullable=True)
    status = Column(String(50), default="PENDING_HEARING")  # PENDING_HEARING, UNDER_COMMITTEE_REVIEW, ALLOWED, DISMISSED
    disposal_order_number = Column(String(100), nullable=True)
    speaking_order = Column(Text, nullable=True)
    resolved_by = Column(String(150), nullable=True)
    filed_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    employee = relationship("Employee", back_populates="appeals")
    application = relationship("PromotionApplication", back_populates="appeals")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    actor_name = Column(String(150), nullable=False)
    actor_role = Column(String(100), nullable=False)
    action_type = Column(String(100), nullable=False)  # CREATE, UPDATE, VERIFY, EVALUATE, ALLOCATE, APPEAL, RISK_ALERT
    target_entity = Column(String(100), nullable=False)  # EMPLOYEE, DOCUMENT, VACANCY, RULE, APPLICATION, APPEAL
    target_id = Column(String(100), nullable=False)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), default="127.0.0.1")
    is_flagged_risk = Column(Boolean, default=False)
    risk_reason = Column(String(255), nullable=True)


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    inquiry_ref = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    official_designation = Column(String(150), nullable=False)
    department = Column(String(200), nullable=False)
    official_email = Column(String(150), nullable=False)
    area_of_interest = Column(String(100), nullable=False)
    message = Column(Text, nullable=True)
    consent_given = Column(Boolean, default=False)
    status = Column(String(50), default="RECEIVED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
