# FairGov AI — Product Requirements Document (PRD)

## 1. Executive Summary & Purpose
**FairGov AI** is an auditable, transparent government employee records and promotion management platform. It addresses systemic administrative challenges in Indian central/state ministries, departments, and directorates by:
- Eliminating fragmented physical service records and repetitive manual data entry.
- Automating document integrity verification with cryptographic hashing (SHA-256) and duplicate alerting.
- Reconciling annual vacancy quotas with cadre strength registers.
- Applying department-approved promotion rules through a configurable, version-controlled rules engine.
- Producing clear, explainable breakdowns for every candidate's eligibility and ranking outcome.
- Maintaining immutable-style audit logs with automated heuristics for detecting unauthorized changes or integrity anomalies.

> [!IMPORTANT]
> **Legal & Regulatory Grounding**: FairGov AI is an administrative assistance tool that enforces approved service rules (such as Central Civil Services Promotion Norms and Department of Personnel & Training OM guidelines). It does **not** bypass statutory authority or replace human review where mandated by law (e.g., Departmental Promotion Committees, DPC).

---

## 2. Target Users & Stakeholders
1. **Government Employees (Feeder Posts)**: Track service history, view active vacancy notices, submit promotion applications, verify receipt hashes, and file formal appeals/correction requests.
2. **Establishment Verifiers**: Verify supporting service books, APAR dossiers, integrity certificates, and category credentials; record explicit justification and timestamps for every status change.
3. **HR / Under Secretaries (Establishment Officers)**: Reconcile vacancies, publish notices, approve employee record updates, and monitor roster points.
4. **Promotion Committees (DPC / Review Committees)**: Execute transparent rules evaluation, review edge cases (e.g., pending vigilance inquiries under sealed cover rules), inspect explainability breakdowns, and issue speaking orders on grievances.
5. **Department Administrators (Joint Secretaries / HoDs)**: Oversee establishment metrics, rule versioning, and compliance.
6. **Vigilance & Security Auditors**: Independent read-only access to tamper-evident audit logs, risk alerts, and change histories.

---

## 3. Core Functional Modules
| Module ID | Module Name | Key Functionality |
| :--- | :--- | :--- |
| **MOD-01** | Employee Records Management | Searchable profile, unique reference ID (`GOV-CADRE-YYYY-XXXX`), service tenure, APAR scores, vigilance clearance, salted identity hashing for duplicate alerts. |
| **MOD-02** | Document Verification & Integrity | File upload, MIME & 15MB size checks, SHA-256 checksum calculation, duplicate hash alerts, verifier audit with mandatory reasons. |
| **MOD-03** | Annual Vacancy Management | Draft, review, and publication of vacancy notices; causes breakdown (retirement, promotion, etc.); sanctioned strength reconciliation; revision history. |
| **MOD-04** | Promotion Applications & Receipts | Submission against published vacancies; automated receipt hash (`FAIRGOV-RECEIPT::...`); status tracking; withdrawal support. |
| **MOD-05** | Configurable Rules & Explainability | Versioned rule sets linked to official orders (e.g., DoPT OMs); minimum qualifying service; APAR benchmark checks; mathematical formula display; tie-breaker logic. |
| **MOD-06** | Quota-Aware Ranking & Allocation | Provisional ranking; UR merit allocation followed by reserved category roster allocation (SC, ST, OBC, EWS, PwBD) without arbitrary overrides. |
| **MOD-07** | Audit Trails & Risk Alerts | Comprehensive event logging (Actor, Role, Action, Entity, Diff, IP); automated heuristics for post-publication vacancy edits, duplicate file reuse, and unauthorized actions. |
| **MOD-08** | Grievance & Statutory Appeals | Formal representation filing; hearing status; disposal order number and speaking order documentation. |

---

## 4. Technical Quality Standards
- **Integrity Validation**: SHA-256 for all uploaded files.
- **Auditability**: Every mutation logged with previous vs. new values.
- **Explainability**: Math formula and criteria pass/fail explanation presented directly in UI.
- **Data Hygiene**: Synthetic realistic data used in demonstration environments.
