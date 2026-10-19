# FairGov AI — System Architecture & Data-Flow Specification

## 1. Architectural Principles
FairGov AI employs a modular, secure, API-first architecture designed to align with the Ministry of Electronics and Information Technology (MeitY) and National Informatics Centre (NIC) enterprise standards:
1. **Decoupled Presentation & Business Logic**: Fast, accessible React + TypeScript frontend communicating over authenticated, typed REST endpoints with a Python FastAPI backend.
2. **Statutory Rules Separation**: Promotion criteria, benchmark definitions, and quota formulas are separated from the code engine into version-controlled rule objects linked to official government Office Memorandums (e.g., DoPT OM No. 22011/1/2023-Estt(D)).
3. **Cryptographic Checksumming**: Every service book, credential, and dossier file receives a SHA-256 hash upon ingestion to prevent unauthorized substitution or tampering.
4. **Verifiable Receipts**: Promotion application submissions issue a deterministic receipt hash combining the applicant reference, vacancy identifier, and submission timestamp.
5. **Auditable Lifecycle Trajectory**: All state transitions record actor, role, IP address, and pre/post state differences.

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph ClientLayer ["Client & Evaluation Layer"]
        A1["Browser Client (Desktop / Tablet)"]
        A2["Role Persona Context (Employee, Verifier, HR, Committee, Admin, Auditor)"]
    end

    subgraph APIGateway ["API & Security Gateway (FastAPI)"]
        B1["CORS & Request Validation (Pydantic v2)"]
        B2["RBAC Middleware & Least Privilege Enforcer"]
        B3["File Size & MIME Sanitization Filter"]
    end

    subgraph ServiceModules ["Business Logic Engines"]
        C1["Employee Records & Cadre Module"]
        C2["Document Vault & SHA-256 Hasher"]
        C3["Annual Vacancy & Cadre Reconciler"]
        C4["Configurable Promotion Rules Engine"]
        C5["Quota & Tie-Breaker Allocator"]
        C6["Statutory Grievance & Appeals Module"]
    end

    subgraph StorageLayer ["Persistence & Audit Layer"]
        D1[("Relational Database (PostgreSQL / SQLite Demo)")]
        D2[("Encrypted File Storage (Private Vault)")]
        D3[("Immutable-Style Audit Trail Register")]
    end

    A1 -->|HTTPS / REST API| B1
    A2 -->|Context Headers| B2
    B1 --> B2
    B2 --> B3
    B3 --> C1 & C2 & C3 & C4 & C5 & C6
    C1 --> D1
    C2 --> D1 & D2
    C3 --> D1
    C4 --> D1
    C5 --> D1
    C6 --> D1
    C1 & C2 & C3 & C4 & C5 & C6 -.->|Every Mutation Logged| D3
```

---

## 3. End-to-End Data Flow

### Flow 1: Document Upload & Integrity Check
1. Officer/Assistant uploads PDF/image (capped at 15MB).
2. FastAPI processes file bytes and executes `calculate_sha256_bytes(bytes)`.
3. System executes a collision query: `SELECT id FROM documents WHERE file_sha256 = :hash`.
4. If identical hash found, `is_duplicate_flag` is set to `True` and an automated audit risk anomaly is logged.
5. Document saved to private storage vault with status `SUBMITTED`.

### Flow 2: Promotion Eligibility & Explainable Evaluation
1. Establishment section triggers evaluation for a published vacancy notice.
2. System loads active `PromotionRuleSet` linked to the feeder designation.
3. For each candidate application:
   - **Tenure Check**: `(evaluation_cutoff_date - joining_date).days / 365.25 >= min_years_qualifying_service`.
   - **Benchmark Check**: `average(last_5_years_apar) >= apar_benchmark`.
   - **Vigilance Check**: `vigilance_status == "CLEAR"` (if `PENDING_INQUIRY`, flagged for Sealed Cover).
   - **Scoring**: `Seniority Score = min(100, (years / 15) * 100)`; `Merit Score = (apar_avg / 5.0) * 100`.
   - `Composite Score = (Seniority × seniority_weight%) + (Merit × merit_weight%)`.
4. Algorithm assigns provisional rank, applying statutory tie-breakers:
   - Priority 1: Seniority of feeder appointment date.
   - Priority 2: Date of birth (older candidate ranked higher).
5. Quotas allocated: UR merit filled first; reserved category quotas (SC, ST, OBC, EWS, PwBD) filled subsequently.
6. Complete math substitution string stored in `evaluation_result` for instant candidate transparency.
