import datetime
from sqlalchemy.orm import Session
from .models import (
    Employee, Document, CorrectionRequest, VacancyNotice, PromotionRuleSet,
    PromotionApplication, Appeal, AuditEvent, Inquiry
)
from .utils.hasher import calculate_sha256_bytes, generate_receipt_hash, generate_identity_hash

def seed_database(db: Session):
    """Populates the database with realistic synthetic demonstration data."""
    # Check if data already exists
    if db.query(Employee).count() > 0:
        return

    # 1. Create Promotion Rule Set
    rule_css_us = PromotionRuleSet(
        rule_code="DOPT-OM-2024-US-PROM",
        title="Central Civil Services (Group A) Under Secretary Promotion Norms 2024",
        official_reference="DoPT OM No. 22011/1/2023-Estt(D) dated 12/01/2024",
        effective_date=datetime.date(2024, 1, 1),
        version="v2.1",
        feeder_designation="Section Officer",
        target_designation="Under Secretary",
        min_years_qualifying_service=5.0,
        apar_benchmark=4.0,  # "Very Good"
        require_vigilance_clearance=True,
        seniority_weight=60.0,
        merit_apar_weight=40.0,
        tie_breaker_hierarchy=[
            "DATE_OF_ENTRY_FEEDER_GRADE",
            "DATE_OF_BIRTH",
            "SENIORITY_ROLL_NO"
        ],
        status="ACTIVE"
    )
    db.add(rule_css_us)
    db.flush()

    # 2. Create Vacancy Notice
    vacancy_us = VacancyNotice(
        notice_code="VAC-2024-DOPT-US-001",
        title="Annual Promotion Round 2024 - Under Secretary (CSS Cadre)",
        target_cadre="Central Secretariat Service (CSS)",
        target_designation="Under Secretary",
        target_pay_level=11,
        feeder_designation="Section Officer",
        total_vacancies=5,
        breakdown_ur=3,
        breakdown_sc=1,
        breakdown_st=1,
        breakdown_obc=0,
        breakdown_ews=0,
        breakdown_pwbd=0,
        vacancy_causes={
            "retirement": 2,
            "promotion_outflow_to_deputy_secretary": 2,
            "deputation_reserve": 1
        },
        sanctioned_reconciliation="Sanctioned Strength: 140 | In-Position: 135 | Net Vacancies for DPC 2024: 5",
        status="PUBLISHED",
        published_date=datetime.date(2024, 2, 1),
        application_deadline=datetime.date(2024, 12, 31),
        created_by="Sh. Rajesh Verma, Under Secretary (Estt.)",
        revision_count=1,
        revision_notes=[{
            "timestamp": "2024-02-01T10:00:00Z",
            "note": "Initial vacancy notice published after reconciliation with cadre strength register."
        }]
    )
    db.add(vacancy_us)
    db.flush()

    # 3. Create Synthetic Employees
    demo_employees_data = [
        {
            "employee_ref": "GOV-CSS-2017-0104",
            "full_name": "Vikram Singh Rathore",
            "email": "vikram.rathore.demo@gov.in",
            "department": "Department of Personnel & Training",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2017, 3, 15),
            "dob": datetime.date(1985, 4, 10),
            "category": "UR",
            "pay_level": 8,
            "apar_scores": {"2019-20": 4.9, "2020-21": 4.9, "2021-22": 4.8, "2022-23": 5.0, "2023-24": 4.9, "average": 4.90},
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2017-0211",
            "full_name": "Meenakshi Sundaram",
            "email": "meenakshi.sundaram.demo@gov.in",
            "department": "Ministry of Finance (Dept of Expenditure)",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2017, 8, 20),
            "dob": datetime.date(1987, 11, 25),
            "category": "UR",
            "pay_level": 8,
            "apar_scores": {"2019-20": 4.8, "2020-21": 4.9, "2021-22": 4.8, "2022-23": 4.9, "2023-24": 4.9, "average": 4.86},
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2018-0421",
            "full_name": "Aniket Sharma",
            "email": "aniket.sharma.demo@gov.in",
            "department": "Ministry of Home Affairs",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2018, 5, 10),
            "dob": datetime.date(1988, 7, 14),
            "category": "UR",
            "pay_level": 8,
            "apar_scores": {"2019-20": 4.7, "2020-21": 4.8, "2021-22": 4.7, "2022-23": 4.8, "2023-24": 4.8, "average": 4.76},
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2018-0422",
            "full_name": "Gurpreet Singh",
            "email": "gurpreet.singh.demo@gov.in",
            "department": "Department of Commerce",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2018, 5, 10),  # Same joining date as Aniket Sharma (Tie-breaker test)
            "dob": datetime.date(1986, 2, 19),           # Older than Aniket (DOB tie-breaker wins)
            "category": "UR",
            "pay_level": 8,
            "apar_scores": {"2019-20": 4.7, "2020-21": 4.8, "2021-22": 4.7, "2022-23": 4.8, "2023-24": 4.8, "average": 4.76},
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2018-0655",
            "full_name": "Priya Lakshmi Nair",
            "email": "priya.nair.demo@gov.in",
            "department": "Ministry of Social Justice & Empowerment",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2018, 9, 1),
            "dob": datetime.date(1989, 3, 30),
            "category": "SC",
            "pay_level": 8,
            "apar_scores": {"2019-20": 4.6, "2020-21": 4.7, "2021-22": 4.8, "2022-23": 4.7, "2023-24": 4.7, "average": 4.70},
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2018-0890",
            "full_name": "Kavita Ramachandran",
            "email": "kavita.ramachandran.demo@gov.in",
            "department": "Ministry of Tribal Affairs",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2018, 11, 15),
            "dob": datetime.date(1990, 8, 12),
            "category": "ST",
            "pay_level": 8,
            "apar_scores": {"2019-20": 4.5, "2020-21": 4.6, "2021-22": 4.6, "2022-23": 4.7, "2023-24": 4.6, "average": 4.60},
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2019-0334",
            "full_name": "Sunita Devi",
            "email": "sunita.devi.demo@gov.in",
            "department": "Ministry of Rural Development",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2019, 1, 10),
            "dob": datetime.date(1987, 5, 18),
            "category": "OBC",
            "pay_level": 8,
            "apar_scores": {"2019-20": 4.5, "2020-21": 4.6, "2021-22": 4.6, "2022-23": 4.7, "2023-24": 4.6, "average": 4.60},
            "vigilance_status": "PENDING_INQUIRY",  # Edge Case: Requires Sealed Cover / Committee Review
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2019-0912",
            "full_name": "Mohammad Tariq",
            "email": "mohammad.tariq.demo@gov.in",
            "department": "Department of Telecommunications",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2019, 3, 20),
            "dob": datetime.date(1986, 9, 5),
            "category": "UR",
            "pay_level": 8,
            "apar_scores": {"2019-20": 3.6, "2020-21": 3.7, "2021-22": 3.6, "2022-23": 3.8, "2023-24": 3.6, "average": 3.66},  # Edge Case: Below 4.0 APAR benchmark
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        },
        {
            "employee_ref": "GOV-CSS-2021-0118",
            "full_name": "Rajesh Kumar Verma",
            "email": "rajesh.verma.demo@gov.in",
            "department": "Ministry of External Affairs",
            "designation": "Section Officer",
            "cadre": "Central Secretariat Service (CSS)",
            "joining_date": datetime.date(2021, 6, 1),  # Edge Case: Short of 5-year qualifying service requirement
            "dob": datetime.date(1991, 10, 15),
            "category": "UR",
            "pay_level": 8,
            "apar_scores": {"2021-22": 4.8, "2022-23": 4.9, "2023-24": 4.9, "average": 4.86},
            "vigilance_status": "CLEAR",
            "service_status": "ACTIVE"
        }
    ]

    employees = []
    for item in demo_employees_data:
        ident_hash = generate_identity_hash(item["full_name"], item["dob"].isoformat(), item["department"])
        emp = Employee(
            **item,
            identity_hash=ident_hash,
            record_version=1
        )
        db.add(emp)
        employees.append(emp)

    db.flush()

    # 4. Create Sample Documents with verified cryptographic hashes
    demo_docs = [
        {
            "employee_id": employees[0].id,
            "document_name": "Service_Book_Entry_Vikram_Rathore.pdf",
            "doc_type": "SERVICE_BOOK",
            "file_path": "/demo_vault/service_books/vikram_rathore_sb.pdf",
            "file_size": 142580,
            "mime_type": "application/pdf",
            "file_sha256": calculate_sha256_bytes(b"DEMO_CONTENT_VIKRAM_RATHORE_SERVICE_BOOK"),
            "verification_status": "VERIFIED",
            "verifier_name": "Smt. Priya Nair",
            "verifier_role": "Establishment Verifier",
            "verifier_notes": "Entries cross-verified with physical service register vol. IV.",
            "verified_at": datetime.datetime.utcnow() - datetime.timedelta(days=12)
        },
        {
            "employee_id": employees[1].id,
            "document_name": "APAR_Dossier_Meenakshi_Sundaram.pdf",
            "doc_type": "APAR_DOSSIER",
            "file_path": "/demo_vault/apar/meenakshi_sundaram_apar.pdf",
            "file_size": 204890,
            "mime_type": "application/pdf",
            "file_sha256": calculate_sha256_bytes(b"DEMO_CONTENT_MEENAKSHI_APAR_DOSSIER"),
            "verification_status": "VERIFIED",
            "verifier_name": "Smt. Priya Nair",
            "verifier_role": "Establishment Verifier",
            "verifier_notes": "All 5 years complete with reporting and reviewing officer signatures.",
            "verified_at": datetime.datetime.utcnow() - datetime.timedelta(days=10)
        },
        {
            "employee_id": employees[2].id,
            "document_name": "Service_Book_Aniket_Sharma.pdf",
            "doc_type": "SERVICE_BOOK",
            "file_path": "/demo_vault/service_books/aniket_sharma_sb.pdf",
            "file_size": 185400,
            "mime_type": "application/pdf",
            "file_sha256": calculate_sha256_bytes(b"DEMO_CONTENT_ANIKET_SHARMA_SB"),
            "verification_status": "VERIFIED",
            "verifier_name": "Smt. Priya Nair",
            "verifier_role": "Establishment Verifier",
            "verifier_notes": "Verified. Feeder grade appointment date 10/05/2018 confirmed.",
            "verified_at": datetime.datetime.utcnow() - datetime.timedelta(days=8)
        },
        {
            "employee_id": employees[4].id,
            "document_name": "Caste_Certificate_Priya_Nair.pdf",
            "doc_type": "CASTE_CERTIFICATE",
            "file_path": "/demo_vault/certificates/priya_nair_caste.pdf",
            "file_size": 98200,
            "mime_type": "application/pdf",
            "file_sha256": calculate_sha256_bytes(b"DEMO_CONTENT_PRIYA_NAIR_CASTE_CERT"),
            "verification_status": "VERIFIED",
            "verifier_name": "Smt. Priya Nair",
            "verifier_role": "Establishment Verifier",
            "verifier_notes": "Authenticated against State Revenue Authority caste issuing registry.",
            "verified_at": datetime.datetime.utcnow() - datetime.timedelta(days=5)
        },
        {
            "employee_id": employees[6].id,
            "document_name": "Integrity_Certificate_Sunita_Devi.pdf",
            "doc_type": "INTEGRITY_CERTIFICATE",
            "file_path": "/demo_vault/certificates/sunita_devi_ic.pdf",
            "file_size": 89400,
            "mime_type": "application/pdf",
            "file_sha256": calculate_sha256_bytes(b"DEMO_CONTENT_SUNITA_DEVI_IC"),
            "verification_status": "DISPUTED",
            "verifier_name": "Smt. Priya Nair",
            "verifier_role": "Establishment Verifier",
            "verifier_notes": "Vigilance branch reported pending disciplinary inquiry Ref: CVC/DISC/2023/891. Forwarded for committee scrutiny.",
            "verified_at": datetime.datetime.utcnow() - datetime.timedelta(days=3)
        },
        {
            "employee_id": employees[7].id,
            "document_name": "Experience_Certificate_Tariq.pdf",
            "doc_type": "EXPERIENCE_CERTIFICATE",
            "file_path": "/demo_vault/certificates/tariq_exp.pdf",
            "file_size": 112000,
            "mime_type": "application/pdf",
            "file_sha256": calculate_sha256_bytes(b"DEMO_CONTENT_TARIQ_EXP"),
            "verification_status": "UNDER_VERIFICATION",
            "verifier_name": None,
            "verifier_role": None,
            "verifier_notes": None,
            "verified_at": None
        }
    ]

    for doc_item in demo_docs:
        doc = Document(**doc_item)
        db.add(doc)

    db.flush()

    # 5. Create Correction Requests
    correction_1 = CorrectionRequest(
        employee_id=employees[2].id,
        field_name="department",
        current_value="Ministry of Home Affairs",
        requested_value="Ministry of Home Affairs (Internal Security-I)",
        reason="Division name reorganization as per Office Order No. 42/2023.",
        status="APPROVED",
        reviewed_by="Sh. Rajesh Verma, Under Secretary (Estt.)",
        review_notes="Approved based on attached administrative order.",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=15),
        reviewed_at=datetime.datetime.utcnow() - datetime.timedelta(days=14)
    )
    db.add(correction_1)

    # 6. Create Promotion Applications for the Vacancy
    apps = []
    for idx, emp in enumerate(employees):
        app_num = f"APP-2024-US-{idx+1:04d}"
        receipt = generate_receipt_hash(app_num, emp.employee_ref, "2024-02-15T10:00:00Z")
        app = PromotionApplication(
            application_number=app_num,
            vacancy_notice_id=vacancy_us.id,
            employee_id=emp.id,
            status="SUBMITTED",
            receipt_hash=receipt,
            submitted_at=datetime.datetime.utcnow() - datetime.timedelta(days=20 - idx)
        )
        db.add(app)
        apps.append(app)

    db.flush()

    # 7. Create Appeals
    appeal_1 = Appeal(
        appeal_number="APL-2024-0001",
        application_id=apps[7].id,  # Mohammad Tariq
        employee_id=employees[7].id,
        grievance_type="APAR_ASSESSMENT",
        description="Representation against below-benchmark APAR grading for reporting year 2021-22 citing administrative transfer mid-cycle.",
        supporting_doc_ref="Representation dated 14/02/2024 with copy to Competent Authority",
        status="UNDER_COMMITTEE_REVIEW",
        filed_at=datetime.datetime.utcnow() - datetime.timedelta(days=6)
    )
    db.add(appeal_1)

    # 8. Create Realistic Audit Events
    audit_events = [
        AuditEvent(
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=25),
            actor_name="System Setup Routine",
            actor_role="System Administrator",
            action_type="CREATE",
            target_entity="RULE",
            target_id=rule_css_us.rule_code,
            details={"action": "Configured promotion rule set based on DoPT OM No. 22011/1/2023-Estt(D)"},
            is_flagged_risk=False
        ),
        AuditEvent(
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=22),
            actor_name="Sh. Rajesh Verma",
            actor_role="HR / Under Secretary",
            action_type="CREATE",
            target_entity="VACANCY",
            target_id=vacancy_us.notice_code,
            details={"total_vacancies": 5, "cadre": "CSS", "sanctioned": 140, "in_position": 135},
            is_flagged_risk=False
        ),
        AuditEvent(
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=12),
            actor_name="Smt. Priya Nair",
            actor_role="Document Verifier",
            action_type="VERIFY",
            target_entity="DOCUMENT",
            target_id="DOC-VIKRAM-SB",
            details={"status": "VERIFIED", "hash_verified": True},
            is_flagged_risk=False
        ),
        AuditEvent(
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=3),
            actor_name="Smt. Priya Nair",
            actor_role="Document Verifier",
            action_type="VERIFY",
            target_entity="DOCUMENT",
            target_id="DOC-SUNITA-IC",
            details={"status": "DISPUTED", "reason": "Disciplinary inquiry flag in vigilance register."},
            is_flagged_risk=True,
            risk_reason="Integrity dispute raised on promotion applicant document."
        )
    ]
    for ev in audit_events:
        db.add(ev)

    # 9. Create Sample Inquiries
    inq_1 = Inquiry(
        inquiry_ref="INQ-2024-001",
        name="Sh. D. K. Sengupta",
        official_designation="Director (Establishment)",
        department="Department of Administrative Reforms & Public Grievances",
        official_email="dk.sengupta.demo@gov.in",
        area_of_interest="Controlled Pilot for Cadre Promotion System",
        message="Interested in conducting an authorized pilot for Group B to Group A promotion workflow under DARPG guidelines.",
        consent_given=True,
        status="ACKNOWLEDGED"
    )
    db.add(inq_1)

    db.commit()
