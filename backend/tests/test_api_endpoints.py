import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["synthetic_data"] is True

def test_dashboard_stats():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_demo_employees" in data
    assert data["total_demo_employees"] > 0
    assert "disclaimer" in data

def test_get_employees():
    response = client.get("/api/employees")
    assert response.status_code == 200
    employees = response.json()
    assert len(employees) >= 5
    # Verify Aniket Sharma is in the synthetic dataset
    assert any("Aniket Sharma" in e["full_name"] for e in employees)

def test_get_vacancies():
    response = client.get("/api/vacancies")
    assert response.status_code == 200
    vacancies = response.json()
    assert len(vacancies) > 0
    assert vacancies[0]["status"] == "PUBLISHED"

def test_evaluate_promotion_applications():
    # Fetch first vacancy
    vacancies_res = client.get("/api/vacancies")
    vac_id = vacancies_res.json()[0]["id"]

    eval_res = client.post(f"/api/promotions/applications/evaluate/{vac_id}")
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert "evaluations" in eval_data
    assert len(eval_data["evaluations"]) > 0

    # Test explainability endpoint for first application
    app_id = eval_data["evaluations"][0]["application_id"]
    explain_res = client.get(f"/api/promotions/applications/{app_id}/explain")
    assert explain_res.status_code == 200
    explain_data = explain_res.json()
    assert "formula_explanation" in explain_data["evaluation_details"]
    assert "criteria_breakdown" in explain_data["evaluation_details"]

def test_submit_demonstration_inquiry():
    payload = {
        "name": "Dr. Rajeshwar Rao",
        "official_designation": "Joint Secretary (Admin)",
        "department": "Ministry of Electronics & Information Technology",
        "official_email": "rajeshwar.rao.demo@meity.gov.in",
        "area_of_interest": "Auditable Promotion Workflows",
        "message": "Requesting a 30-minute demonstration for our establishment committee.",
        "consent_given": True
    }
    response = client.post("/api/inquiries", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "inquiry_ref" in data
    assert data["status"] == "RECEIVED"
