# FairGov AI — Role & Permission Matrix (RBAC)

## 1. Overview & Separation of Duties
To ensure accountability, prevent conflicts of interest, and safeguard statutory due process, FairGov AI enforces strict separation of duties across seven distinct operational roles.

> [!IMPORTANT]
> **Separation of Duties Principle**: System administrators manage technical infrastructure, database connectivity, and telemetry, but are **explicitly barred** from altering candidate scores, modifying promotion outcomes, or overruling committee findings. Any attempt by administrative roles to directly manipulate scoring triggers an immediate risk alert in the audit log.

---

## 2. Role Definitions

| Role Identifier | Official Designation Benchmark | Core Administrative Purpose |
| :--- | :--- | :--- |
| **Employee** | Feeder Post Officer (e.g. Section Officer) | View personal service records, apply for vacancies, track receipt hashes, request corrections, and file statutory appeals. |
| **Document Verifier** | Senior Establishment Assistant / Verifier | Authenticate supporting service books, APAR dossiers, and certificates; record mandatory verification rationale and timestamps. |
| **HR / Establishment Officer** | Under Secretary / Establishment Officer | Reconcile vacancies against sanctioned post registers, publish vacancy notices, approve service record corrections, and manage cadre rosters. |
| **Promotion Committee (DPC)** | Committee Members / Reviewers (Deputy Secy / Director) | Trigger the eligibility rules engine, review sealed-cover cases, inspect explainable scoring breakdowns, and dispose appeals with speaking orders. |
| **Department Admin** | Joint Secretary / Head of Department | Oversee cadre analytics, approve promotion rule set versions, and ensure statutory compliance. |
| **Security & Vigilance Auditor** | Vigilance Officer / External Auditor | Independent read-only inspection of immutable-style audit trails, anomaly alerts, and post-publication vacancy modifications. |
| **System Administrator** | Technical Infrastructure Lead | Server uptime, backup execution, and infrastructure configuration; strictly barred from evaluation decisions. |

---

## 3. Granular Permission Matrix

| Capability / Action | Employee | Document Verifier | HR Officer | Promotion Committee | Dept Admin | Security Auditor | System Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Own Employee Record** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Other Officers' Dossiers** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Create / Update Employee Profile** | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Submit Service Correction Request** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Approve / Reject Correction Request** | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Upload Supporting Dossier Document** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Verify / Dispute / Reject Document** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Create / Publish Vacancy Notice** | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Revise Vacancy Count Post-Publication** | ❌ | ❌ | ⚠️ Logged | ❌ | ⚠️ Logged | ❌ | ❌ |
| **Submit Promotion Application** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Execute Rules Engine & Rank Candidates** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **View Candidate Explainability Breakdown** | ✅ (Own) | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Manually Edit Candidate Merit Score** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ (Prohibited) |
| **File Statutory Grievance Appeal** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Issue Speaking Order on Appeal** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Inspect Audit Trails & Anomaly Alerts** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Export Audit Logs (JSON / CSV)** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

*Legend: ✅ Permitted | ❌ Denied | ⚠️ Permitted with mandatory justification & automatic security alert*
