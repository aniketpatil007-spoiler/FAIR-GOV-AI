# FairGov AI — Test Report & Known Limitations

## 1. Automated Test Execution Summary
The FairGov AI platform includes an automated pytest suite covering critical promotion calculations, cryptographic hash algorithms, tie-breaker evaluations, quota allocations, and REST API endpoints.

- **Test Suite Framework**: `pytest 9.1.1` on Python 3.12.10
- **Total Automated Tests Executed**: 14
- **Passed**: 14 (100% Pass Rate)
- **Failed**: 0
- **Execution Duration**: 0.99 seconds

---

## 2. Test Cases & Boundary Condition Coverage

| Test Case Identifier | Module / Logic Tested | Scenario & Boundary Condition | Result |
| :--- | :--- | :--- | :--- |
| `test_eligible_candidate` | Rules Engine | Officer with 6.0 years service (qualifying req: 5.0), APAR 4.5 (benchmark: 4.0), and CLEAR vigilance. | ✅ PASSED (`ELIGIBLE`) |
| `test_ineligible_due_to_service_shortfall` | Rules Engine | Officer with 3.0 years service (boundary shortfall of 2.0 years against 5.0 year statutory rule). | ✅ PASSED (`INELIGIBLE` with exact shortfall noted) |
| `test_ineligible_due_to_apar_benchmark` | Rules Engine | Officer meets service length but APAR average is 3.5 (boundary failure against 4.0 "Very Good" threshold). | ✅ PASSED (`INELIGIBLE`) |
| `test_requires_review_due_to_pending_vigilance` | Rules Engine | Candidate meets service and APAR criteria, but has a `PENDING_INQUIRY` vigilance status. | ✅ PASSED (`REQUIRES_REVIEW` - Sealed Cover) |
| `test_tie_breaker_and_quota_allocation` | Allocation Engine | Two competing officers with identical composite scores (85.0) and identical feeder entry dates. Tested age tie-breaker: older officer correctly awarded higher provisional rank. Tested quota allocation: UR merit slot awarded, then reserved SC quota awarded to next qualified candidate. | ✅ PASSED (Rank #1 awarded by age tie-breaker; Quotas strictly allocated) |
| `test_calculate_sha256_bytes` | Cryptographic Hasher | SHA-256 byte digest repeatability and sensitivity to single-byte corruption. | ✅ PASSED |
| `test_generate_receipt_hash` | Receipt Generator | Application receipt verification hash reproducibility. | ✅ PASSED |
| `test_generate_identity_hash_duplicate_detection` | Identity Hasher | Salted identity hash matching identical records across differing whitespace/casing. | ✅ PASSED |
| `test_health_check` | API Endpoints | REST endpoint `/api/health` status reporting. | ✅ PASSED |
| `test_dashboard_stats` | API Endpoints | Dashboard summary metrics computation and disclaimer presence. | ✅ PASSED |
| `test_get_employees` | API Endpoints | Querying employee profiles and synthetic dataset integrity. | ✅ PASSED |
| `test_get_vacancies` | API Endpoints | Querying published vacancies and quota breakdowns. | ✅ PASSED |
| `test_evaluate_promotion_applications` | API Endpoints | Full batch evaluation endpoint and decision explainability JSON payload generation. | ✅ PASSED |
| `test_submit_demonstration_inquiry` | API Endpoints | Demonstration request validation, consent verification, and reference ID generation. | ✅ PASSED |

---

## 3. Known Limitations & Prototype Boundaries

In keeping with our transparency principles, the following technical limitations apply to the current evaluation prototype:
1. **Single-Node In-Process Database**:
   - The evaluation prototype runs on SQLite (`fairgov_demo.db`). For production multi-ministry deployment, migration to clustered PostgreSQL with read replicas and row-level security (RLS) is required.
2. **Asynchronous Antivirus Scanning**:
   - File uploads in the prototype validate file size (15MB cap) and MIME types. Real-time ClamAV stream scanning requires integration with an external daemon or S3 bucket notification trigger.
3. **Identity Provider Integration**:
   - The prototype simulates role personas (Employee, Verifier, HR Officer, DPC Member, Admin, Auditor) through an interactive header selector to facilitate separation-of-duties testing. Production requires binding to Parichay OAuth2 / SAML2.
4. **Third-Party OCR Document Extraction**:
   - Automated text extraction from physical paper scans is flagged for verification rather than treated as authoritative issuer validation.
