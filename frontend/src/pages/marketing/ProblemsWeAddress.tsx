import React from 'react';
import { Database, Copy, AlertOctagon, Calculator, UserCheck, EyeOff, ShieldAlert, Clock, ArrowRight } from 'lucide-react';

export const ProblemsWeAddress: React.FC = () => {
  const problems = [
    {
      icon: Database,
      title: "Fragmented Employee Records",
      challenge: "Service history, cadre postings, leave accounts, and APAR gradings often reside across disparate physical registers and ad-hoc spreadsheets.",
      solution: "Consolidated single-source employee profile with version-controlled service records, unique reference IDs, and cadre hierarchy."
    },
    {
      icon: Copy,
      title: "Repeated Manual Data Entry",
      challenge: "Establishment sections frequently re-key basic service details and qualifications across successive annual promotion rounds.",
      solution: "Reusable verified digital dossiers that automatically carry forward certified service facts, eliminating redundant transcription."
    },
    {
      icon: AlertOctagon,
      title: "Inconsistent or Duplicate Documents",
      challenge: "Physical submissions risk missing supporting annexures, unauthenticated copies, or duplicate filings that create administrative confusion.",
      solution: "Cryptographic SHA-256 integrity checksums, automated duplicate file hash detection, and mandatory verifier timestamped reasoning."
    },
    {
      icon: Calculator,
      title: "Complex Annual Vacancy Calculations",
      challenge: "Reconciling sanctioned cadre strength, retirement outflows, deputation reserves, and category reservation rosters requires painstaking manual tallying.",
      solution: "Structured vacancy notices with cause attribution (retirement, promotion, etc.) and explicit reconciliation against cadre sanction registers."
    },
    {
      icon: UserCheck,
      title: "Manual Eligibility Checking & Ranking",
      challenge: "Screening hundreds of candidates against qualifying service lengths and multi-year APAR benchmarks manually is labor-intensive and prone to oversight.",
      solution: "Configurable rules engine that evaluates service cutoffs and APAR benchmarks transparently while preserving DPC committee authority."
    },
    {
      icon: EyeOff,
      title: "Limited Visibility into Decision History",
      challenge: "When a promotion order is contested, reconstructing how individual seniority ranks or eligibility determinations were computed can take weeks.",
      solution: "Mathematical explainability breakdowns showing exact substituted values, criteria checklists, and official order citations for every candidate."
    },
    {
      icon: ShieldAlert,
      title: "Risk of Unauthorized Alterations",
      challenge: "Spreadsheet-based rosters lack tamper evidence, creating vulnerability to unnoticed score overrides or post-announcement vacancy changes.",
      solution: "Role-based separation of duties, prevention of silent score edits, and immutable-style audit logs with automated anomaly alerts."
    },
    {
      icon: Clock,
      title: "Delays in Communicating Decisions",
      challenge: "Months may elapse between DPC proceedings and formal communication, increasing employee anxiety and the volume of administrative RTI queries.",
      solution: "Digital application tracking, instantaneous cryptographic receipt hashes, and formal statutory appeal workflows with documented speaking orders."
    }
  ];

  return (
    <section id="problems" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span>Administrative Bottlenecks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            Problems FairGov AI is Designed to Address
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Government establishment branches manage monumental volumes of casework under rigorous service rules. FairGov AI is specifically engineered to alleviate structural administrative burdens, reduce manual error rates, and support officials with verifiable tools.
          </p>
          <p className="text-xs text-slate-500 italic">
            *Identified as systemic operational challenges inherent in paper-based workflows, not as accusations against administrative departments.
          </p>
        </div>

        {/* 8 Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-white transition-all shadow-2xs group"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#0f2942] text-teal-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-rose-700 block mb-0.5">Existing Bottleneck:</span>
                      <p className="text-slate-600 leading-relaxed">{item.challenge}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-teal-700 block mb-0.5">FairGov AI Solution:</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
