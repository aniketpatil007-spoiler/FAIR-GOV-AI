# FairGov AI — Security & Threat Assessment

## 1. Threat Modeling Overview
This document evaluates the FairGov AI platform against potential security threats, administrative integrity risks, and unauthorized manipulation scenarios in accordance with CERT-In and Indian Digital Personal Data Protection (DPDP) Act frameworks.

---

## 2. Threat Vector Analysis & Mitigation Matrix

### Threat 1: Unauthorized Direct Modification of Candidate Scores
- **Threat Scenario**: An administrator or rogue actor attempts to edit individual candidate APAR averages or seniority points to alter promotion rankings.
- **Vulnerability**: Legacy systems storing mutable spreadsheet cells without field-level audit protection.
- **Mitigation in FairGov AI**:
  - The API does **not** expose an endpoint allowing arbitrary score updates.
  - Candidate scores are calculated deterministically on-the-fly by `rules_engine.py` using attested service records and APAR inputs.
  - Any administrative update to an underlying employee record increments the record version number and logs the pre-change and post-change diff with the actor's identity and justification.

### Threat 2: Substitution or Tampering with Supporting Dossiers
- **Threat Scenario**: An applicant or clerk replaces an adverse integrity certificate or APAR dossier with a falsified file.
- **Mitigation in FairGov AI**:
  - Every file uploaded has its SHA-256 cryptographic digest calculated and stored permanently.
  - When a verifier authenticates a file, their determination is cryptographically bound to that exact checksum.
  - If a file is substituted, the SHA-256 hash will not match the verified hash, immediately invalidating the verification status.

### Threat 3: Re-use of Fraudulent or Duplicate Documents Across Candidates
- **Threat Scenario**: An applicant submits a forged certificate or identical degree/experience document already submitted by another candidate.
- **Mitigation in FairGov AI**:
  - Upon upload, the platform queries the repository for identical SHA-256 digests.
  - If a collision occurs, the platform sets `is_duplicate_flag = True` and creates an automatic integrity risk alert in the audit log for the verifier to inspect.

### Threat 4: Covert Modification of Published Vacancy Quotas
- **Threat Scenario**: After vacancy publication and application submission, an official secretly increases or decreases reserved category slots to favor specific candidates.
- **Mitigation in FairGov AI**:
  - Vacancy notices track revision counts and mandatory revision notes.
  - Modifying vacancy counts on an already `PUBLISHED` notice automatically triggers a high-severity `RISK_ALERT` in the audit registry (`Sensitive post-publication modification to vacancy quota`).

### Threat 5: Privilege Escalation by System Administrators
- **Threat Scenario**: Technical staff use database or server credentials to alter committee decisions.
- **Mitigation in FairGov AI**:
  - Strict separation of duties: System Administrator roles have infrastructure telemetry access but are blocked at the application layer from evaluating promotion rounds or issuing speaking orders.
  - In production, database tables containing evaluation results are write-protected using DB triggers and external log shipping.

---

## 3. Defense-in-Depth Implementation Roadmap

| Control Layer | Prototype Implementation | Production Target Implementation |
| :--- | :--- | :--- |
| **Transport** | TLS 1.3 / Enforced HTTPS | TLS 1.3 + mTLS between microservices |
| **Authentication** | Role-Based Persona Simulation | Parichay / Jan Parichay National SSO + FIDO2 Hardware Tokens |
| **Integrity** | In-Memory & SQLite SHA-256 Hashes | Hardware Security Module (HSM) Signed Promotion Orders |
| **Storage Security** | Local Private Vault with Path Sanitization | Encrypted Object Storage (AES-256-GCM) with WORM Compliance |
| **Audit Logs** | Relational Audit Table with Diff Capturing | External Append-Only SIEM Log Forwarding (Syslog/Elastic) |
