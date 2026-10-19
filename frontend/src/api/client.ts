import {
  DashboardStats, Employee, DocumentRecord, CorrectionRequest,
  VacancyNotice, PromotionRuleSet, PromotionApplication, Appeal,
  AuditEvent, InquiryPayload, InquiryResponse, ExplainabilityDetails
} from '../types';

const API_BASE = '/api';

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  return res.json();
}

export async function fetchEmployees(search?: string, department?: string): Promise<Employee[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (department) params.append('department', department);
  const res = await fetch(`${API_BASE}/employees?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function fetchEmployee(id: number): Promise<Employee> {
  const res = await fetch(`${API_BASE}/employees/${id}`);
  if (!res.ok) throw new Error('Failed to fetch employee');
  return res.json();
}

export async function createEmployee(data: any, actorName: string, actorRole: string): Promise<Employee> {
  const res = await fetch(`${API_BASE}/employees?actor_name=${encodeURIComponent(actorName)}&actor_role=${encodeURIComponent(actorRole)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create employee profile');
  }
  return res.json();
}

export async function requestCorrection(empId: number, data: { field_name: string; current_value: string; requested_value: string; reason: string }): Promise<CorrectionRequest> {
  const res = await fetch(`${API_BASE}/employees/${empId}/corrections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employee_id: empId, ...data })
  });
  if (!res.ok) throw new Error('Failed to submit correction request');
  return res.json();
}

export async function fetchCorrections(): Promise<CorrectionRequest[]> {
  const res = await fetch(`${API_BASE}/employees/corrections/list`);
  if (!res.ok) throw new Error('Failed to fetch correction requests');
  return res.json();
}

export async function reviewCorrection(id: number, decision: string, reviewedBy: string, reviewNotes: string): Promise<CorrectionRequest> {
  const res = await fetch(`${API_BASE}/employees/corrections/${id}/review`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, reviewed_by: reviewedBy, review_notes: reviewNotes })
  });
  if (!res.ok) throw new Error('Failed to review correction request');
  return res.json();
}

export async function fetchDocuments(empId?: number, status?: string): Promise<DocumentRecord[]> {
  const params = new URLSearchParams();
  if (empId) params.append('employee_id', empId.toString());
  if (status) params.append('status', status);
  const res = await fetch(`${API_BASE}/documents?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function verifyDocument(
  docId: number,
  action: 'VERIFY' | 'DISPUTE' | 'REJECT',
  verifierName: string,
  verifierRole: string,
  reason: string
): Promise<DocumentRecord> {
  const res = await fetch(`${API_BASE}/documents/${docId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      verifier_name: verifierName,
      verifier_role: verifierRole,
      reason
    })
  });
  if (!res.ok) throw new Error('Failed to update document verification status');
  return res.json();
}

export async function fetchVacancies(): Promise<VacancyNotice[]> {
  const res = await fetch(`${API_BASE}/vacancies`);
  if (!res.ok) throw new Error('Failed to fetch vacancies');
  return res.json();
}

export async function createVacancy(data: any, actorName: string, actorRole: string): Promise<VacancyNotice> {
  const res = await fetch(`${API_BASE}/vacancies?actor_name=${encodeURIComponent(actorName)}&actor_role=${encodeURIComponent(actorRole)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create vacancy notice');
  return res.json();
}

export async function updateVacancy(id: number, data: any, actorName: string, actorRole: string): Promise<VacancyNotice> {
  const res = await fetch(`${API_BASE}/vacancies/${id}?actor_name=${encodeURIComponent(actorName)}&actor_role=${encodeURIComponent(actorRole)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update vacancy notice');
  return res.json();
}

export async function fetchRulesets(): Promise<PromotionRuleSet[]> {
  const res = await fetch(`${API_BASE}/promotions/rulesets`);
  if (!res.ok) throw new Error('Failed to fetch promotion rulesets');
  return res.json();
}

export async function fetchApplications(vacancyId?: number): Promise<PromotionApplication[]> {
  const params = new URLSearchParams();
  if (vacancyId) params.append('vacancy_id', vacancyId.toString());
  const res = await fetch(`${API_BASE}/promotions/applications?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch promotion applications');
  return res.json();
}

export async function submitApplication(vacancyId: number, employeeId: number): Promise<PromotionApplication> {
  const res = await fetch(`${API_BASE}/promotions/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vacancy_notice_id: vacancyId, employee_id: employeeId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to submit promotion application');
  }
  return res.json();
}

export async function evaluateVacancyApplications(
  vacancyId: number,
  actorName: string,
  actorRole: string
): Promise<{ message: string; evaluations: any[]; vacancy_code: string; official_reference: string }> {
  const res = await fetch(`${API_BASE}/promotions/applications/evaluate/${vacancyId}?actor_name=${encodeURIComponent(actorName)}&actor_role=${encodeURIComponent(actorRole)}`, {
    method: 'POST'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to evaluate applications');
  }
  return res.json();
}

export async function explainDecision(applicationId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/promotions/applications/${applicationId}/explain`);
  if (!res.ok) throw new Error('Failed to fetch decision explanation');
  return res.json();
}

export async function fetchAppeals(): Promise<Appeal[]> {
  const res = await fetch(`${API_BASE}/promotions/appeals`);
  if (!res.ok) throw new Error('Failed to fetch appeals');
  return res.json();
}

export async function fileAppeal(applicationId: number, employeeId: number, grievanceType: string, description: string): Promise<Appeal> {
  const res = await fetch(`${API_BASE}/promotions/appeals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      application_id: applicationId,
      employee_id: employeeId,
      grievance_type: grievanceType,
      description
    })
  });
  if (!res.ok) throw new Error('Failed to file appeal');
  return res.json();
}

export async function reviewAppeal(appealId: number, decision: string, speakingOrder: string, orderNumber: string, resolvedBy: string): Promise<Appeal> {
  const res = await fetch(`${API_BASE}/promotions/appeals/${appealId}/review`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      decision,
      speaking_order: speakingOrder,
      disposal_order_number: orderNumber,
      resolved_by: resolvedBy
    })
  });
  if (!res.ok) throw new Error('Failed to resolve appeal');
  return res.json();
}

export async function fetchAuditEvents(riskOnly: boolean = false, targetEntity?: string): Promise<AuditEvent[]> {
  const params = new URLSearchParams();
  if (riskOnly) params.append('risk_only', 'true');
  if (targetEntity) params.append('target_entity', targetEntity);
  const res = await fetch(`${API_BASE}/audit?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch audit events');
  return res.json();
}

export async function submitInquiry(data: InquiryPayload): Promise<InquiryResponse> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Inquiry submission failed. Please verify form details.');
  }
  return res.json();
}
