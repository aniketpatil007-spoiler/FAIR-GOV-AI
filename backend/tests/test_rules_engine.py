import pytest
import datetime
from backend.app.models import Employee, VacancyNotice, PromotionRuleSet, PromotionApplication
from backend.app.rules_engine import evaluate_candidate_eligibility, rank_and_allocate_applications

@pytest.fixture
def sample_ruleset():
    return PromotionRuleSet(
        rule_code="TEST-RULE-001",
        title="Test Promotion Norms",
        official_reference="DoPT OM No. 22011/1/2023-Estt(D)",
        effective_date=datetime.date(2024, 1, 1),
        feeder_designation="Section Officer",
        target_designation="Under Secretary",
        min_years_qualifying_service=5.0,
        apar_benchmark=4.0,
        require_vigilance_clearance=True,
        seniority_weight=60.0,
        merit_apar_weight=40.0,
        tie_breaker_hierarchy=["DATE_OF_ENTRY_FEEDER_GRADE", "DATE_OF_BIRTH"]
    )

def test_eligible_candidate(sample_ruleset):
    emp = Employee(
        id=1,
        employee_ref="EMP-001",
        full_name="Eligible Candidate",
        email="el@gov.in",
        department="DoPT",
        designation="Section Officer",
        cadre="CSS",
        joining_date=datetime.date(2018, 1, 1),
        dob=datetime.date(1985, 1, 1),
        category="UR",
        apar_scores={"average": 4.5},
        vigilance_status="CLEAR"
    )
    result = evaluate_candidate_eligibility(emp, sample_ruleset, datetime.date(2024, 1, 1))
    assert result["overall_status"] == "ELIGIBLE"
    assert result["service_years"] >= 5.0
    assert result["composite_score"] > 0
    assert "Minimum Qualifying Service" in [c["criterion"] for c in result["criteria_breakdown"]]

def test_ineligible_due_to_service_shortfall(sample_ruleset):
    # Candidate joined only 3 years ago (needs 5)
    emp = Employee(
        id=2,
        employee_ref="EMP-002",
        full_name="Short Service",
        email="short@gov.in",
        department="DoPT",
        designation="Section Officer",
        cadre="CSS",
        joining_date=datetime.date(2022, 1, 1),
        dob=datetime.date(1990, 1, 1),
        category="UR",
        apar_scores={"average": 4.8},
        vigilance_status="CLEAR"
    )
    result = evaluate_candidate_eligibility(emp, sample_ruleset, datetime.date(2024, 1, 1))
    assert result["overall_status"] == "INELIGIBLE"
    assert "Shortfall" in result["criteria_breakdown"][1]["note"]

def test_ineligible_due_to_apar_benchmark(sample_ruleset):
    # Candidate meets service (6 years) but APAR average is 3.5 (needs 4.0)
    emp = Employee(
        id=3,
        employee_ref="EMP-003",
        full_name="Low APAR",
        email="low@gov.in",
        department="DoPT",
        designation="Section Officer",
        cadre="CSS",
        joining_date=datetime.date(2018, 1, 1),
        dob=datetime.date(1986, 1, 1),
        category="UR",
        apar_scores={"average": 3.5},
        vigilance_status="CLEAR"
    )
    result = evaluate_candidate_eligibility(emp, sample_ruleset, datetime.date(2024, 1, 1))
    assert result["overall_status"] == "INELIGIBLE"

def test_requires_review_due_to_pending_vigilance(sample_ruleset):
    emp = Employee(
        id=4,
        employee_ref="EMP-004",
        full_name="Pending Vigilance",
        email="vig@gov.in",
        department="DoPT",
        designation="Section Officer",
        cadre="CSS",
        joining_date=datetime.date(2018, 1, 1),
        dob=datetime.date(1987, 1, 1),
        category="UR",
        apar_scores={"average": 4.6},
        vigilance_status="PENDING_INQUIRY"
    )
    result = evaluate_candidate_eligibility(emp, sample_ruleset, datetime.date(2024, 1, 1))
    assert result["overall_status"] == "REQUIRES_REVIEW"

def test_tie_breaker_and_quota_allocation():
    # Setup vacancy with 1 UR and 1 SC slot
    vac = VacancyNotice(
        id=1,
        notice_code="VAC-TEST",
        title="Test Vacancy",
        target_cadre="CSS",
        target_designation="Under Secretary",
        target_pay_level=11,
        feeder_designation="Section Officer",
        total_vacancies=2,
        breakdown_ur=1,
        breakdown_sc=1,
        breakdown_st=0,
        breakdown_obc=0,
        breakdown_ews=0,
        breakdown_pwbd=0
    )

    # Candidate A: UR, Composite 85, Joining 2018-05-10, DOB 1988-07-14
    emp_a = Employee(
        id=10, employee_ref="A", full_name="Candidate A", email="a@gov.in",
        department="DoPT", designation="SO", cadre="CSS",
        joining_date=datetime.date(2018, 5, 10), dob=datetime.date(1988, 7, 14), category="UR"
    )
    app_a = PromotionApplication(
        id=101, application_number="APP-A", vacancy_notice_id=1, employee_id=10,
        status="ELIGIBLE", composite_score=85.0, receipt_hash="hash_a"
    )
    app_a.employee = emp_a

    # Candidate B: UR, Same Composite 85, Same Joining 2018-05-10, but older DOB 1986-02-19 (Tie-breaker winner!)
    emp_b = Employee(
        id=11, employee_ref="B", full_name="Candidate B", email="b@gov.in",
        department="DoPT", designation="SO", cadre="CSS",
        joining_date=datetime.date(2018, 5, 10), dob=datetime.date(1986, 2, 19), category="UR"
    )
    app_b = PromotionApplication(
        id=102, application_number="APP-B", vacancy_notice_id=1, employee_id=11,
        status="ELIGIBLE", composite_score=85.0, receipt_hash="hash_b"
    )
    app_b.employee = emp_b

    # Candidate C: SC, Composite 80 (Qualified for SC quota)
    emp_c = Employee(
        id=12, employee_ref="C", full_name="Candidate C", email="c@gov.in",
        department="DoPT", designation="SO", cadre="CSS",
        joining_date=datetime.date(2018, 9, 1), dob=datetime.date(1989, 3, 30), category="SC"
    )
    app_c = PromotionApplication(
        id=103, application_number="APP-C", vacancy_notice_id=1, employee_id=12,
        status="ELIGIBLE", composite_score=80.0, receipt_hash="hash_c"
    )
    app_c.employee = emp_c

    allocations = rank_and_allocate_applications([app_a, app_b, app_c], vac)

    # Candidate B should win rank 1 due to older age tie-breaker
    assert allocations[0]["application_id"] == 102
    assert allocations[0]["is_allocated"] == True
    assert "UR" in allocations[0]["allocated_quota"]

    # Candidate A gets rank 2, UR quota was only 1 so Candidate A is not allocated UR
    assert allocations[1]["application_id"] == 101
    assert allocations[1]["is_allocated"] == False

    # Candidate C gets rank 3 and gets the SC quota slot
    assert allocations[2]["application_id"] == 103
    assert allocations[2]["is_allocated"] == True
    assert "SC" in allocations[2]["allocated_quota"]
