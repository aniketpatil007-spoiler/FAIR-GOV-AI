# FairGov AI — Government Procurement & GeM Readiness Checklist

## 1. Compliance Disclaimer
> [!CAUTION]
> **Procurement Verification Notice**: In accordance with government integrity standards, this checklist outlines the technical criteria required for public procurement under Government of India guidelines. FairGov AI is currently presented for **technical evaluation and controlled pilot demonstration**; formal compliance with specific tenders, GeM categories, or certifications is determined following departmental testing and third-party audit.

---

## 2. GeM & GFR 2017 Procurement Readiness Checklist

| Evaluation Parameter | Public Procurement Benchmark | FairGov AI Current Architecture Status |
| :--- | :--- | :--- |
| **GeM Category Alignment** | Custom Software Solution / Cloud SaaS under Rule 149 of GFR 2017 | Productized SaaS / On-Premise containerized architecture ready for GeM catalogue listing. |
| **Data Localization** | 100% of employee data, dossiers, and logs stored within Indian sovereign territory | No foreign data routing. Designed for deployment in MeitY-empanelled data centres or State Data Centres (SDC). |
| **Open Standards Support** | National Open Source Policy (MeitY) & open REST API interfaces | Built using open standards (Python FastAPI, React, PostgreSQL/SQLite, standard JSON). |
| **Source Code Audit Readiness** | Vulnerability assessment & penetration testing (VAPT) by CERT-In empaneled auditor | Code structured with OWASP Top 10 defenses, parameterized SQL queries, and zero hardcoded credentials. |
| **Vendor Non-Lock-in** | Complete data exportability in standard tabular formats (CSV, JSON, SQL) | Native export endpoints for audit logs, employee master lists, and provisional seniority rosters. |

---

## 3. GIGW 3.0 (Guidelines for Indian Government Websites) Checklist

| GIGW Criterion | Objective Requirement | Implementation Strategy in FairGov AI |
| :--- | :--- | :--- |
| **Visual Accessibility** | WCAG 2.1 Level AA color contrast, scalable typography, and no color-only status coding | High-contrast navy/white palette (`#0f2942`), explicit text labels accompanying all status icons. |
| **Screen Reader Support** | Semantic HTML5 landmarks (`header`, `main`, `nav`, `section`) and ARIA labels | Clean DOM hierarchy, accessible table markup with `th scope="col"`. |
| **Keyboard Navigation** | Complete tab sequence for modal dialogs and data tables | Focus management on modal open/close, esc-key handlers, and visible focus rings. |
| **Responsive Portability** | Usable across desktop, tablet, and mobile displays without horizontal scroll overflow | Responsive Tailwind CSS grid and flex layouts tested down to 320px viewport. |

---

## 4. Indicative Implementation & Support Cost Structure

To assist departmental budgeting for pilot and scaled deployment:

1. **Phase 1: Controlled Pilot (6–8 Weeks)**:
   - Cadre scoping, rule parameter configuration, synthetic/sanitized data ingestion, and UAT workshops.
2. **Phase 2: Production Cadre Rollout (Annual Software Subscription / License)**:
   - Sizing based on active employee count in cadre (e.g., Tier A: Up to 500 records; Tier B: Up to 2,500 records; Tier C: Enterprise Ministry-wide).
3. **Infrastructure & Hosting (Pass-Through / Departmental SDC)**:
   - Deployed on department's existing NIC Cloud (MeghRaj), State Data Centre, or MeitY-empanelled CSP VPC.
4. **Annual Maintenance & Statutory Rule Updates (AMC)**:
   - Updates for newly notified DoPT OMs, pay commission revisions, or reservation roster amendments.
