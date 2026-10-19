# FairGov AI — Data Retention & Privacy Policy Proposal

## 1. Statutory Alignment
This proposed policy governs the processing, retention, and controlled archiving of employee records, service documents, promotion applications, and audit trails within the FairGov AI platform. It aligns with:
- The **Digital Personal Data Protection (DPDP) Act, 2023** (Principles of Purpose Limitation & Data Minimization).
- The **Public Records Act, 1993** (Government of India record retention and declassification norms).
- General Financial Rules (GFR) and Central Civil Services guidelines.

---

## 2. Privacy by Design: PII Minimization
1. **Deterministic Salted Identity Tokens**:
   - Instead of storing plain Aadhaar, PAN, or sensitive identity numbers in database search indexes, FairGov AI computes a one-way deterministic salted identity hash:
     $$\text{Token} = \text{SHA-256}(\text{Name} \mathbin{\Vert} \text{DOB} \mathbin{\Vert} \text{Department} \mathbin{\Vert} \text{SecretSalt})$$
   - This allows instant duplicate account detection without exposing unencrypted personal identification data.
2. **Access Need-to-Know**:
   - Candidates can only inspect their personal dossiers, applications, and decision explanations.
   - Verifiers only see files queued for their assigned cadre branch.
   - General public marketing pages use 100% synthetic fictional data with zero real government PII.

---

## 3. Data Retention Lifecycle

| Record Classification | Retention Duration | Justification & Legal Basis | Disposal Method |
| :--- | :--- | :--- | :--- |
| **Active Service Dossiers** | Duration of active employment + 10 years post-retirement | CCS Pension Rules & Service Book maintenance guidelines. | Digital archiving to National Archives / Permanent Record Storage. |
| **DPC Promotion Proceedings & Rosters** | 10 Years from Gazette notification date | Mandated for administrative tribunal (CAT) and judicial scrutiny. | Formal archival with immutable hash seal. |
| **Unsuccessful Promotion Applications** | 3 Years post-cycle completion | Standard period for disposal of representations and RTI requests. | Secure automated cryptographic deletion. |
| **Document Vault Uploads (Disputed/Rejected)** | 5 Years after dispute resolution | Preserved as evidence for departmental vigilance proceedings. | Secure purge following competent authority sign-off. |
| **Audit Trails & Security Incident Logs** | Permanent / Minimum 15 Years | CERT-In guidelines and Public Records Act compliance. | WORM encrypted tape / SDC cold storage. |

---

## 4. Employee Data Subject Rights
- **Right to Rectification**: Employees may submit formal service correction requests with attached office orders via the employee portal.
- **Right to Grievance Redressal**: Formal appeal mechanism against provisional eligibility or seniority lists with guaranteed speaking orders.
- **Traceability of Access**: Every viewing of an employee's service dossier by HR or verifiers is recorded in the immutable audit log.
