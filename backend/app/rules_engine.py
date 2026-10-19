import datetime
from typing import Dict, Any, List, Tuple
from .models import Employee, VacancyNotice, PromotionRuleSet, PromotionApplication

def evaluate_candidate_eligibility(
    employee: Employee,
    ruleset: PromotionRuleSet,
    evaluation_date: datetime.date = None
) -> Dict[str, Any]:
    """
    Evaluates an employee's promotion eligibility against a specified rule set.
    Returns a transparent, explainable breakdown suitable for official scrutiny.
    """
    if evaluation_date is None:
        evaluation_date = datetime.date.today()

    # 1. Service tenure calculation
    days_in_service = (evaluation_date - employee.joining_date).days
    years_in_service = round(days_in_service / 365.25, 2)
    service_pass = years_in_service >= ruleset.min_years_qualifying_service

    service_check = {
        "criterion": "Minimum Qualifying Service",
        "rule_requirement": f">= {ruleset.min_years_qualifying_service} years in feeder post ({ruleset.feeder_designation})",
        "candidate_actual": f"{years_in_service} years (Joined {employee.joining_date.isoformat()})",
        "status": "PASS" if service_pass else "FAIL",
        "note": f"Candidate has served {years_in_service} years as of cutoff date." if service_pass
                else f"Shortfall of {round(ruleset.min_years_qualifying_service - years_in_service, 2)} years."
    }

    # 2. Feeder post match check
    feeder_match = employee.designation.strip().lower() == ruleset.feeder_designation.strip().lower()
    designation_check = {
        "criterion": "Feeder Cadre Designation",
        "rule_requirement": ruleset.feeder_designation,
        "candidate_actual": employee.designation,
        "status": "PASS" if feeder_match else "FAIL",
        "note": "Candidate holds the designated feeder appointment." if feeder_match
                else f"Candidate holds '{employee.designation}', not recognized feeder post '{ruleset.feeder_designation}'."
    }

    # 3. APAR Benchmark check
    apar_data = employee.apar_scores or {}
    apar_avg = float(apar_data.get("average", 0.0))
    apar_pass = apar_avg >= ruleset.apar_benchmark
    apar_check = {
        "criterion": "APAR Assessment Benchmark",
        "rule_requirement": f"Benchmark >= {ruleset.apar_benchmark} / 5.0 over preceding 5 years",
        "candidate_actual": f"Composite APAR: {apar_avg:.2f} / 5.0",
        "status": "PASS" if apar_pass else "FAIL",
        "note": f"Candidate meets benchmark benchmark ({apar_avg:.2f} >= {ruleset.apar_benchmark})." if apar_pass
                else f"Below minimum benchmark ({apar_avg:.2f} < {ruleset.apar_benchmark})."
    }

    # 4. Vigilance Clearance check
    vigilance_status = employee.vigilance_status.upper()
    if vigilance_status == "CLEAR":
        vigilance_state = "PASS"
        vigilance_note = "Vigilance clearance formally recorded as CLEAR with no pending disciplinary proceedings."
    elif vigilance_status == "PENDING_INQUIRY":
        vigilance_state = "REVIEW"
        vigilance_note = "Disciplinary or vigilance inquiry pending. Case requires Departmental Promotion Committee (DPC) sealed-cover consideration."
    else:
        vigilance_state = "FAIL"
        vigilance_note = "Adverse vigilance status recorded. Candidate not eligible under statutory discipline rules."

    vigilance_check = {
        "criterion": "Vigilance Clearance",
        "rule_requirement": "Vigilance status must be CLEAR without adverse findings",
        "candidate_actual": vigilance_status,
        "status": vigilance_state,
        "note": vigilance_note
    }

    # Overall Status Determination
    if not feeder_match or not service_pass or not apar_pass or vigilance_state == "FAIL":
        overall_status = "INELIGIBLE"
        status_summary = "Candidate does not meet one or more mandatory statutory criteria."
    elif vigilance_state == "REVIEW":
        overall_status = "REQUIRES_REVIEW"
        status_summary = "Candidate meets academic/service criteria but requires DPC committee review for vigilance status."
    else:
        overall_status = "ELIGIBLE"
        status_summary = "Candidate meets all statutory service, APAR benchmark, and vigilance requirements."

    # Scoring calculations (Normalized out of 100)
    # Seniority score: capped at 15 years max tenure for 100 points
    seniority_score = round(min(100.0, (years_in_service / 15.0) * 100.0), 2)
    # Merit score: APAR / 5.0 * 100
    merit_score = round((apar_avg / 5.0) * 100.0, 2)
    # Composite score: weighted sum
    w_sen = ruleset.seniority_weight / 100.0
    w_mer = ruleset.merit_apar_weight / 100.0
    composite_score = round((seniority_score * w_sen) + (merit_score * w_mer), 2)

    formula_explanation = (
        f"Composite Score = (Seniority Score × {ruleset.seniority_weight}%) + (APAR Merit × {ruleset.merit_apar_weight}%)\n"
        f"= ({seniority_score:.2f} × {w_sen:.2f}) + ({merit_score:.2f} × {w_mer:.2f})\n"
        f"= {round(seniority_score * w_sen, 2)} + {round(merit_score * w_mer, 2)} = {composite_score:.2f} / 100"
    )

    return {
        "overall_status": overall_status,
        "status_summary": status_summary,
        "service_years": years_in_service,
        "seniority_score": seniority_score,
        "merit_score": merit_score,
        "composite_score": composite_score,
        "formula_explanation": formula_explanation,
        "official_rule_reference": ruleset.official_reference,
        "rule_code": ruleset.rule_code,
        "criteria_breakdown": [
            designation_check,
            service_check,
            apar_check,
            vigilance_check
        ],
        "tie_breaker_rules": ruleset.tie_breaker_hierarchy or [
            "DATE_OF_ENTRY_FEEDER_GRADE",
            "DATE_OF_BIRTH",
            "SENIORITY_ROLL_NO"
        ]
    }


def rank_and_allocate_applications(
    applications: List[PromotionApplication],
    vacancy: VacancyNotice
) -> List[Dict[str, Any]]:
    """
    Ranks candidates based on transparent rules and allocates vacancies according to
    statutory reservation quotas (UR, SC, ST, OBC, EWS, PwBD).
    Returns list of allocation details.
    """
    # Sort key:
    # 1. Eligibility (ELIGIBLE > REQUIRES_REVIEW > INELIGIBLE)
    # 2. Composite Score descending
    # 3. Earlier joining date (Seniority tie-breaker)
    # 4. Earlier DOB (Age tie-breaker)
    status_order = {"ELIGIBLE": 1, "REQUIRES_REVIEW": 2, "INELIGIBLE": 3, "SUBMITTED": 4, "WITHDRAWN": 5}

    def sort_key(app: PromotionApplication):
        s_rank = status_order.get(app.status, 99)
        comp_score = -(app.composite_score or 0.0)
        joining_ts = app.employee.joining_date.toordinal() if app.employee else 999999
        dob_ts = app.employee.dob.toordinal() if app.employee else 999999
        return (s_rank, comp_score, joining_ts, dob_ts)

    sorted_apps = sorted(applications, key=sort_key)

    # Track available quota slots
    quotas = {
        "UR": vacancy.breakdown_ur,
        "SC": vacancy.breakdown_sc,
        "ST": vacancy.breakdown_st,
        "OBC": vacancy.breakdown_obc,
        "EWS": vacancy.breakdown_ews,
        "PwBD": vacancy.breakdown_pwbd,
    }

    results = []
    current_rank = 1

    for app in sorted_apps:
        app.provisional_rank = current_rank
        current_rank += 1
        allocated = False
        allocated_quota = None

        if app.status == "ELIGIBLE":
            emp_cat = (app.employee.category or "UR").upper()
            # 1. Top merit candidates qualify for unreserved (UR) slots regardless of social category
            if quotas.get("UR", 0) > 0:
                quotas["UR"] -= 1
                allocated = True
                allocated_quota = "UR (Merit)"
            # 2. If UR is exhausted, check candidate's specific reserved category quota
            elif quotas.get(emp_cat, 0) > 0:
                quotas[emp_cat] -= 1
                allocated = True
                allocated_quota = f"{emp_cat} (Reserved)"

        app.is_allocated = allocated
        app.allocated_quota = allocated_quota

        results.append({
            "application_id": app.id,
            "application_number": app.application_number,
            "employee_id": app.employee_id,
            "employee_name": app.employee.full_name if app.employee else "Unknown",
            "category": app.employee.category if app.employee else "UR",
            "provisional_rank": app.provisional_rank,
            "composite_score": app.composite_score,
            "status": app.status,
            "is_allocated": allocated,
            "allocated_quota": allocated_quota
        })

    return results
