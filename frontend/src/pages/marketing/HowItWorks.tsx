import React, { useState } from 'react';
import {
  User, CheckCircle, FileText, Send, Scale, BarChart2,
  Users2, Megaphone, HelpCircle, ShieldCheck, ChevronRight
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      name: "Employee Records Setup",
      role: "Establishment Nodal Officer",
      status: "Active / Verified Profile",
      timestamp: "Initial Onboarding / Cadre Register",
      whatHappensNext: "Records are queued for supporting document submission and identity verification.",
      desc: "Employee profiles are created with official designations, cadre appointment dates, pay levels, and multi-year APAR averages.",
      icon: User
    },
    {
      id: 2,
      name: "Document Verification",
      role: "Establishment Verifier",
      status: "Verified with SHA-256 Hash",
      timestamp: "Pre-DPC Scrutiny Cycle",
      whatHappensNext: "Verified records become eligible to apply for announced vacancies.",
      desc: "Service books, caste credentials, and integrity certificates are validated. Cryptographic hashes and verifier rationale are recorded.",
      icon: CheckCircle
    },
    {
      id: 3,
      name: "Vacancy Notification",
      role: "HR / Under Secretary",
      status: "Published & Reconciled",
      timestamp: "Annual DPC Calendar Cutoff",
      whatHappensNext: "Eligible feeder post officers are invited to submit promotion applications.",
      desc: "Vacancies arising from retirements, promotions, and restructuring are reconciled against sanctioned post registers and published with reservation quotas.",
      icon: FileText
    },
    {
      id: 4,
      name: "Employee Application",
      role: "Candidate (Feeder Officer)",
      status: "Submitted (Receipt Issued)",
      timestamp: "Application Window (Prior to Deadline)",
      whatHappensNext: "Applications enter the automated eligibility checking pipeline.",
      desc: "Eligible feeder officers submit applications, receiving a verifiable cryptographic receipt hash confirming submission time and attachments.",
      icon: Send
    },
    {
      id: 5,
      name: "Eligibility Assessment",
      role: "Automated Rules Engine",
      status: "Evaluated (Eligible / Ineligible / Review)",
      timestamp: "Automated Batch Run",
      whatHappensNext: "Eligible applicants proceed to score calculation; sealed-cover cases flagged for committee.",
      desc: "The engine checks candidate qualifying service tenure, APAR benchmark thresholds, and vigilance clearance against the department's active rule set.",
      icon: Scale
    },
    {
      id: 6,
      name: "Rule-Based Ranking",
      role: "Automated Rules Engine",
      status: "Ranked (Composite Score & Ties)",
      timestamp: "Provisional Roster Generation",
      whatHappensNext: "Ranking roster forwarded to Departmental Promotion Committee for statutory review.",
      desc: "Calculates seniority and merit scores with transparent formula substitution. Applies statutory tie-breakers (date of feeder entry -> date of birth).",
      icon: BarChart2
    },
    {
      id: 7,
      name: "Authorized Review (Where Mandated)",
      role: "Departmental Promotion Committee (DPC)",
      status: "Reviewed & Approved",
      timestamp: "Formal DPC Meeting",
      whatHappensNext: "Provisional selection list is published for department stakeholder notification.",
      desc: "Authorized officials inspect flagged cases, verify vigilance sealed-cover recommendations, review exceptions, and validate roster allocations.",
      icon: Users2
    },
    {
      id: 8,
      name: "Decision Publication",
      role: "Department Administration",
      status: "Published for Scrutiny",
      timestamp: "Official Gazette / Notice Board",
      whatHappensNext: "A mandatory representation and grievance window opens for any contested determinations.",
      desc: "Provisional selection list and quota allocations are published with complete explainability breakdowns visible to each candidate.",
      icon: Megaphone
    },
    {
      id: 9,
      name: "Appeal or Correction",
      role: "Employee & Review Committee",
      status: "Hearing / Speaking Order",
      timestamp: "Statutory Representation Period",
      whatHappensNext: "Final promotion orders are prepared based on disposed appeals.",
      desc: "Aggrieved officers can file formal representations regarding seniority rank or document assessments. The committee disposes appeals with speaking orders.",
      icon: HelpCircle
    },
    {
      id: 10,
      name: "Audit & Reporting",
      role: "Security & Vigilance Auditor",
      status: "Archived & Compliant",
      timestamp: "Continuous Lifecycle",
      whatHappensNext: "Permanent audit record retained for judicial or parliamentary inspection.",
      desc: "Complete end-to-end audit trails (who, what, when, why, previous vs new values) remain accessible to authorized vigilance oversight.",
      icon: ShieldCheck
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span>End-to-End Governance Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            How FairGov AI Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every step in the promotion workflow features visible statuses, responsible roles, timestamped audit records, and clear transitions to prevent arbitrary delays.
          </p>
        </div>

        {/* Workflow Diagram & Interactive Step Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Step Navigation Rail */}
          <div className="lg:col-span-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
              Select Lifecycle Stage
            </h3>
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-2">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={st.id}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-[#0f2942] text-white shadow-sm font-semibold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                        isSelected ? 'bg-teal-500 text-[#0f2942] font-bold' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {st.id}
                      </div>
                      <span className="truncate">{st.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Deep Dive Card */}
          <div className="lg:col-span-7">
            {(() => {
              const current = steps[activeStep];
              const Icon = current.icon;
              return (
                <div className="p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                          Stage {current.id} of 10
                        </span>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {current.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">
                      {current.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {current.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Responsible Role:</span>
                      <span className="font-semibold text-white">{current.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Timing / Frequency:</span>
                      <span className="font-semibold text-white">{current.timestamp}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
                    <span className="font-semibold text-teal-300 block">What Happens Next:</span>
                    <p className="text-slate-300">{current.whatHappensNext}</p>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
};
