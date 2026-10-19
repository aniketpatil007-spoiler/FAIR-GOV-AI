# FairGov AI — Government Employee Records & Transparent Promotion Management Platform

> **"Less Paperwork. Clearer Decisions. Accountable Governance."**

FairGov AI is a transparent, auditable employee-records and promotion-management platform designed for Indian central/state government ministries, directorates, and public-sector establishment sections. It reduces administrative paperwork, eliminates manual data entry, reconciles annual vacancies, and applies department-approved service rules consistently with explainable mathematical candidate rankings and immutable-style audit trails.

---

## 🏛️ Key Capabilities

- **Consolidated Employee Cadre Records**: Profile management with unique reference IDs (`GOV-CADRE-YYYY-XXXX`), service tenure history, multi-year APAR cycle archives, and salted identity hashing for duplicate account alerts without exposing raw PII.
- **Document Verification & Vault**: SHA-256 cryptographic file checksums, duplicate file hash collision detection, file cap and MIME validation, and formal verification notes with timestamps.
- **Cadre Vacancy Reconciliation**: Annual vacancy notices with attributed causes (retirement, promotion, deputation) reconciled with sanctioned post strength and revision history tracking.
- **Promotion Applications & Cryptographic Receipts**: Streamlined employee applications with verifiable cryptographic submission receipt hashes (`FAIRGOV-RECEIPT::...`).
- **Configurable Promotion Rules & Explainability**: Decoupled rules linked to official orders (e.g., DoPT OM No. 22011/1/2023-Estt(D)), evaluating qualifying service lengths, APAR benchmark thresholds, vigilance clearances, and tie-breakers with transparent mathematical formula substitution.
- **Quota-Aware Ranking & Allocation**: Automated candidate ranking and reservation quota allocation (UR Merit, SC, ST, OBC, EWS, PwBD) according to statutory rosters without arbitrary manual overrides.
- **Separation of Duties & Least Privilege**: 7 distinct operational roles (Employee, Verifier, HR Officer, DPC Member, Dept Admin, Security Auditor, System Admin) with least-privilege enforcement.
- **Immutable-Style Audit Trails**: Pre/post state diff recording with automated heuristic risk detection (e.g., post-publication vacancy modifications, duplicate document checksum reuse).
- **Statutory Grievances & Appeals**: Employee representation filing and formal committee review with recorded speaking orders.

---

## 📂 Project Architecture

```
GOV AI/
├── backend/
│   ├── app/
│   │   ├── config.py              # Environment paths, CORS, and storage settings
│   │   ├── database.py            # SQLAlchemy engine, sessionmaker, and models base
│   │   ├── models.py              # ORM models (Employee, Document, Vacancy, Rule, Application, Appeal, Audit)
│   │   ├── schemas.py             # Pydantic v2 schemas for request validation & serialization
│   │   ├── seed_data.py           # Realistic synthetic government cadre demonstration dataset
│   │   ├── rules_engine.py        # Configurable service rules evaluation & explainable ranking
│   │   ├── routers/               # Modular REST endpoints
│   │   │   ├── employees.py       # Profiles, duplicate checks, corrections
│   │   │   ├── documents.py       # Upload, SHA-256 hashing, verification
│   │   │   ├── vacancies.py       # Vacancy notices, causes, revisions
│   │   │   ├── promotions.py      # Applications, rules evaluation, explainability, appeals
│   │   │   ├── audit.py           # Audit events, risk filtering, JSON export
│   │   │   ├── inquiries.py       # Demonstration and pilot request submissions
│   │   │   └── stats.py           # Dashboard live telemetry with demo disclaimer
│   │   ├── utils/
│   │   │   ├── hasher.py          # SHA-256 digests, receipts, salted identity hashes
│   │   │   └── audit_helper.py    # Event logger with integrity risk heuristics
│   │   └── main.py                # FastAPI entrypoint, lifespan startup, CORS
│   └── tests/
│       ├── test_rules_engine.py   # Unit tests for rules evaluation, edge cases, tie-breakers
│       ├── test_hasher.py         # Unit tests for SHA-256 checksums and receipts
│       └── test_api_endpoints.py  # Integration tests for REST API endpoints
│
├── frontend/
│   ├── src/
│   │   ├── api/client.ts          # Typed REST API client library
│   │   ├── components/            # Header, Navbar, Footer
│   │   ├── pages/marketing/       # Public GovTech marketing & information pages
│   │   │   ├── Hero.tsx
│   │   │   ├── ProblemsWeAddress.tsx
│   │   │   ├── PlatformModules.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TransparencyIntegrity.tsx
│   │   │   ├── SecurityPrivacy.tsx
│   │   │   ├── PilotProgramme.tsx
│   │   │   ├── AboutFairGov.tsx
│   │   │   └── ContactDemo.tsx    # Working inquiry form connected to backend
│   │   ├── pages/demo/            # Interactive demonstration web application
│   │   │   ├── DemoApp.tsx        # Container with role switcher & sub-navigation
│   │   │   ├── DemoDashboard.tsx  # KPI metrics & live audit activity stream
│   │   │   ├── DemoEmployees.tsx  # Service profiles, duplicate detection, corrections
│   │   │   ├── DemoDocuments.tsx  # Document verification vault & SHA-256 checks
│   │   │   ├── DemoVacancies.tsx  # Vacancy causes, rosters, reconciliation
│   │   │   ├── DemoApplications.tsx # Application submissions & receipts
│   │   │   ├── DemoRulesEngine.tsx # Batch evaluation & explainable decision modal
│   │   │   ├── DemoAppeals.tsx    # Representations & speaking orders
│   │   │   └── DemoAudit.tsx      # Filterable audit log & diff inspector
│   │   ├── personas.ts            # Pre-configured test personas for separation of duties
│   │   ├── types.ts               # Complete TypeScript data model definitions
│   │   ├── App.tsx                # App root wiring marketing site and demo app
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.app.json
│
├── docs/                          # Comprehensive Government Procurement & Architecture Pack
│   ├── PRD_FairGov_AI.md
│   ├── ARCHITECTURE_AND_DATA_FLOW.md
│   ├── ROLE_AND_PERMISSION_MATRIX.md
│   ├── SECURITY_AND_THREAT_ASSESSMENT.md
│   ├── DATA_RETENTION_AND_PRIVACY_POLICY.md
│   ├── PILOT_IMPLEMENTATION_PROPOSAL.md
│   ├── PROCUREMENT_AND_GEM_CHECKLIST.md
│   ├── TEST_REPORT_AND_KNOWN_LIMITATIONS.md
│   └── SALES_PITCH_AND_EXECUTIVE_BRIEF.md
│
├── pytest.ini
├── requirements.txt
├── run_backend.bat
├── run_frontend.bat
└── test_all.bat
```

---

## 🚀 Windows Local Setup & Quick Start

### 1. Prerequisites
- **Python 3.11+**
- **Node.js v18+ & npm**

### 2. Backend Setup
1. Activate virtual environment:
   ```cmd
   .venv\Scripts\activate
   ```
2. Install dependencies (already pinned in `requirements.txt`):
   ```cmd
   pip install -r requirements.txt
   ```
3. Run the automated test suite:
   ```cmd
   pytest -v
   ```
4. Start the FastAPI backend server:
   ```cmd
   python -m uvicorn backend.app.main:app --reload --port 8000
   ```
   *Interactive API documentation is accessible at: `http://127.0.0.1:8000/docs`*

### 3. Frontend Setup
1. Navigate to `frontend`:
   ```cmd
   cd frontend
   npm install
   ```
2. Launch the Vite development server:
   ```cmd
   npm run dev
   ```
3. Open your browser at:
   ```
   http://localhost:5173
   ```

---

## 🧪 Automated Test Results
All 14 automated tests passed:
- **8 Rules Engine & Hasher Tests**: Testing minimum service boundaries, APAR benchmark thresholds, sealed-cover vigilance flags, tie-breaker resolution, and SHA-256 repeatability.
- **6 API Integration Tests**: Testing health check, dashboard metrics, employee querying, vacancy lists, batch promotion evaluation, and inquiry registration.

---

## 📜 Government Readiness Disclaimer
*FairGov AI is a proposed GovTech platform designed for evaluation, controlled departmental pilots, and pre-procurement demonstrations. It does not claim formal certification, empanelment, approval, or deployment by the Government of India or any state government until independently tested and procured under applicable rules (e.g. GeM / GFR 2017). All employee records, service books, and vacancy figures depicted in this demonstration are synthetic.*
