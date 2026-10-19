import React from 'react';
import {
  GitPullRequest, CheckCircle2, Shield, FileSpreadsheet,
  Target, BarChart3, Lock, Users, Award, ArrowRight
} from 'lucide-react';

interface PilotProps {
  onRequestDemo: () => void;
}

export const PilotProgramme: React.FC<PilotProps> = ({ onRequestDemo }) => {
  const steps = [
    {
      num: "01",
      title: "Single Administrative Unit Scope",
      desc: "Confined to one designated department or cadre (e.g., Section Officer to Under Secretary, or Assistant to Superintendent)."
    },
    {
      num: "02",
      title: "Limited Sample Cohort",
      desc: "50 to 200 records evaluated using synthetic data or officially authorized pilot dossiers under formal departmental permissions."
    },
    {
      num: "03",
      title: "Department-Approved Rules",
      desc: "The rules engine is configured exclusively using official statutory service rules and recruitment guidelines provided by the competent authority."
    },
    {
      num: "04",
      title: "Zero-Disruption Parallel Run",
      desc: "Conducted alongside the department's existing manual DPC or establishment cycle, with zero impact on official decisions during the pilot."
    },
    {
      num: "05",
      title: "User Acceptance Testing (UAT)",
      desc: "Establishment verifiers, DPC members, and HR officers test workflows and validate user experience in real-world administrative tasks."
    },
    {
      num: "06",
      title: "Security & Privacy Review",
      desc: "Independent technical assessment verifying role-based access, cryptographic file checksums, and audit trail resilience."
    },
    {
      num: "07",
      title: "Discrepancy & Error Measurement",
      desc: "Rigorous comparison measuring processing turnaround time, data transcription errors, and rule calculation fidelity against existing methods."
    },
    {
      num: "08",
      title: "Written Acceptance Gateways",
      desc: "Predetermined evaluation criteria signed off by establishment leadership before any broader production deployment is considered."
    }
  ];

  return (
    <section id="pilot" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <span>Structured Evaluation Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            Proposed Controlled Pilot Programme
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We recommend evaluating FairGov AI through a contained, low-risk pilot that enables government officials to evaluate accuracy, speed, and auditability without operational disruption.
          </p>
        </div>

        {/* 8-Step Pilot Proposal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-teal-400 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-teal-600/30 mb-2 block font-mono">
                  {st.num}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Evaluation Banner */}
        <div className="p-8 rounded-2xl bg-[#0f2942] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl font-bold tracking-tight">
              Ready to Discuss a Pilot for Your Establishment Section?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our team provides synthetic sample datasets, rule configuration templates, and technical walkthroughs tailored to your cadre recruitment rules.
            </p>
          </div>
          <button
            onClick={onRequestDemo}
            className="shrink-0 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-lg text-xs font-semibold tracking-wide shadow transition-colors"
          >
            <span>Request Pilot Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
