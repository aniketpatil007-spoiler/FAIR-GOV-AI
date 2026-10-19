import React from 'react';
import {
  ShieldCheck, Split, FileClock, Calculator, BellRing,
  Scale, AlertTriangle, Cpu, CheckCircle2
} from 'lucide-react';

export const TransparencyIntegrity: React.FC = () => {
  const safeguards = [
    {
      icon: ShieldCheck,
      title: "Strict Role-Based Access Control (RBAC)",
      desc: "Granular permissions ensure employees only view their dossiers, verifiers only authenticate documents, and committee members evaluate applications."
    },
    {
      icon: Split,
      title: "Separation of Duties",
      desc: "System administrators manage server infrastructure but are strictly barred from modifying promotion scores, vacancy allocations, or DPC findings."
    },
    {
      icon: FileClock,
      title: "Recorded History of Changes",
      desc: "Any update to service tenure, designation, or vacancy counts increments the record version and logs the previous vs new value diff with justification."
    },
    {
      icon: Calculator,
      title: "Version-Controlled Promotion Rules",
      desc: "Eligibility parameters are tied to explicit departmental Office Memorandums (e.g. DoPT OMs), effective dates, and published rule versions."
    },
    {
      icon: Scale,
      title: "Explainable Math & Tie-Breakers",
      desc: "Ranking scores display the full formula substitution with criteria pass/fail flags and clear tie-breaker outcomes (entry date, age) without black-box logic."
    },
    {
      icon: BellRing,
      title: "Automated Integrity Anomaly Alerts",
      desc: "Heuristic checks immediately flag suspicious events, such as post-publication vacancy modifications, duplicate file checksum reuse, or off-hours changes."
    }
  ];

  return (
    <section id="transparency" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <span>Governance Controls</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            Transparency, Integrity & Safeguards
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            FairGov AI replaces informal manual calculations with verifiable checks, documented decisions, and clear separation of duties.
          </p>
        </div>

        {/* Safeguards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {safeguards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Honest Architecture Distinction Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-amber-300 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Technical Candor: Prototype Safeguards vs. Production Tamper-Evidence
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We make a critical technical distinction: standard relational database audit logs can be modified by database superusers with root infrastructure access. Therefore, in our prototype evaluation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-xs text-[#0f2942] block mb-1">
                    In This Demonstration Prototype:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>SHA-256 file hashing detects unauthorized file substitution.</li>
                    <li>Application receipt hashes provide verifiable timestamps to employees.</li>
                    <li>Automated heuristic risk flags highlight suspicious actions.</li>
                    <li>Separation of duties enforced at the application API layer.</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-teal-50/60 border border-teal-200">
                  <span className="font-semibold text-xs text-teal-900 block mb-1">
                    Production Enterprise Target Architecture:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li>WORM (Write Once, Read Many) certified cloud or State Data Centre storage.</li>
                    <li>Hardware Security Module (HSM) digital signatures for all DPC orders.</li>
                    <li>External log shipping to dedicated CERT-In / departmental SIEM servers.</li>
                    <li>Periodic cryptographic Merkle tree anchoring for third-party verification.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
