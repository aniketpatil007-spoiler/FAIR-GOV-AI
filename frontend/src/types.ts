export type Role =
  | 'Employee'
  | 'Document Verifier'
  | 'HR Officer'
  | 'Promotion Committee'
  | 'Department Admin'
  | 'Security Auditor'
  | 'System Administrator';

export interface UserPersona {
  name: string;
  role: Role;
  designation: string;
  department: string;
}

export interface Employee {
  id: number;
  employee_ref: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  cadre: string;
  joining_date: string;
  dob: string;
  category: string;
  pay_level: number;
  apar_scores: {
    [key: string]: number;
    average: number;
  };
  vigilance_status: 'CLEAR' | 'PENDING_INQUIRY' | 'ADVERSE';
  service_status: string;
  identity_hash?: string;
  record_version: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: number;
  employee_id: number;
  document_name: string;
  doc_type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_sha256: string;
  is_duplicate_flag: boolean;
  verification_status: 'SUBMITTED' | 'UNDER_VERIFICATION' | 'VERIFIED' | 'DISPUTED' | 'REJECTED';
  verifier_name?: string;
  verifier_role?: string;
  verifier_notes?: string;
  verified_at?: string;
  created_at: string;
}

export interface CorrectionRequest {
  id: number;
  employee_id: number;
  field_name: string;
  current_value: string;
  requested_value: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewed_by?: string;
  review_notes?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface VacancyNotice {
  id: number;
  notice_code: string;
  title: string;
  target_cadre: string;
  target_designation: string;
  target_pay_level: number;
  feeder_designation: string;
  total_vacancies: number;
  breakdown_ur: number;
  breakdown_sc: number;
  breakdown_st: number;
  breakdown_obc: number;
  breakdown_ews: number;
  breakdown_pwbd: number;
  vacancy_causes: {
    [key: string]: number;
  };
  sanctioned_reconciliation?: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'CLOSED';
  published_date?: string;
  application_deadline?: string;
  created_by: string;
  revision_count: number;
  revision_notes: Array<{
    timestamp: string;
    actor?: string;
    note: string;
    changes?: any;
  }>;
  created_at: string;
}

export interface PromotionRuleSet {
  id: number;
  rule_code: string;
  title: string;
  official_reference: string;
  effective_date: string;
  version: string;
  feeder_designation: string;
  target_designation: string;
  min_years_qualifying_service: number;
  apar_benchmark: number;
  require_vigilance_clearance: boolean;
  seniority_weight: number;
  merit_apar_weight: number;
  tie_breaker_hierarchy: string[];
  status: string;
  created_at: string;
}

export interface CriterionCheck {
  criterion: string;
  rule_requirement: string;
  candidate_actual: string;
  status: 'PASS' | 'FAIL' | 'REVIEW';
  note: string;
}

export interface ExplainabilityDetails {
  overall_status: 'ELIGIBLE' | 'INELIGIBLE' | 'REQUIRES_REVIEW';
  status_summary: string;
  service_years: number;
  seniority_score: number;
  merit_score: number;
  composite_score: number;
  formula_explanation: string;
  official_rule_reference: string;
  rule_code: string;
  criteria_breakdown: CriterionCheck[];
  tie_breaker_rules: string[];
}

export interface PromotionApplication {
  id: number;
  application_number: string;
  vacancy_notice_id: number;
  employee_id: number;
  status: 'SUBMITTED' | 'ELIGIBLE' | 'INELIGIBLE' | 'REQUIRES_REVIEW' | 'SHORTLISTED' | 'ALLOCATED' | 'WITHDRAWN';
  receipt_hash: string;
  service_years_calculated: number;
  merit_score: number;
  seniority_score: number;
  composite_score: number;
  provisional_rank?: number;
  is_allocated: boolean;
  allocated_quota?: string;
  evaluation_result?: ExplainabilityDetails;
  committee_remarks?: string;
  submitted_at: string;
  evaluated_at?: string;
}

export interface Appeal {
  id: number;
  appeal_number: string;
  application_id: number;
  employee_id: number;
  grievance_type: string;
  description: string;
  supporting_doc_ref?: string;
  status: 'PENDING_HEARING' | 'UNDER_COMMITTEE_REVIEW' | 'ALLOWED' | 'DISMISSED';
  disposal_order_number?: string;
  speaking_order?: string;
  resolved_by?: string;
  filed_at: string;
  resolved_at?: string;
}

export interface AuditEvent {
  id: number;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  action_type: string;
  target_entity: string;
  target_id: string;
  details: any;
  ip_address: string;
  is_flagged_risk: boolean;
  risk_reason?: string;
}

export interface DashboardStats {
  total_demo_employees: number;
  documents_awaiting_verification: number;
  open_correction_requests: number;
  active_vacancies: number;
  applications_awaiting_assessment: number;
  completed_workflows: number;
  flagged_audit_risks: number;
  total_audit_events: number;
  disclaimer: string;
}

export interface InquiryPayload {
  name: string;
  official_designation: string;
  department: string;
  official_email: string;
  area_of_interest: string;
  message?: string;
  consent_given: boolean;
}

export interface InquiryResponse {
  id: number;
  inquiry_ref: string;
  name: string;
  official_designation: string;
  department: string;
  official_email: string;
  area_of_interest: string;
  status: string;
  created_at: string;
}
