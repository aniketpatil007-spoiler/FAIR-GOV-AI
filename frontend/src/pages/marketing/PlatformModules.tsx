import React from 'react';
import {
  Users, FileCheck, History, Building, Award, Settings,
  Calculator, CheckSquare, ShieldAlert, MessageSquare, BarChart3, LockKeyhole
} from 'lucide-react';

export const PlatformModules: React.FC = () => {
  const modules = [
    {
      id: 1,
      icon: Users,
      title: "1. Employee Records Management",
      desc: "Structured profiles with unique employee reference IDs, department designations, appointment dates, pay levels, and salted duplicate identity detection."
    },
    {
      id: 2,
      icon: FileCheck,
      title: "2. Document Submission & Verification",
      desc: "Upload validation with file size limits, SHA-256 cryptographic hashes, duplicate file reuse alerts, and formal verification notes with verifier timestamps."
    },
    {
      id: 3,
      icon: History,
      title: "3. Service History & Seniority Records",
      desc: "Comprehensive tracking of feeder-grade appointments, inter-se seniority, APAR cycle archives, and recorded version history across career milestones."
    },
    {
      id: 4,
      icon: Building,
      title: "4. Annual Vacancy Management",
      desc: "Draft and published vacancy notices with cause breakdown (retirement, promotion, etc.) and reconciliation against sanctioned post registers."
    },
    {
      id: 5,
      icon: Award,
      title: "5. Promotion Application Management",
      desc: "Structured application submissions, cryptographic receipt tokens, mandatory document checks, and deadline-bound corrections or withdrawals."
    },
    {
      id: 6,
      icon: Settings,
      title: "6. Configurable Eligibility Rules",
      desc: "Version-controlled promotion rule sets linked to official orders (e.g. DoPT OMs), specifying qualifying service, APAR benchmark thresholds, and vigilance criteria."
    },
    {
      id: 7,
      icon: Calculator,
      title: "7. Explainable Candidate Ranking",
      desc: "Transparent candidate scoring displaying the exact math formula, substituted figures, criteria checklist, and statutory tie-breaker criteria (e.g. entry date, DOB)."
    },
    {
      id: 8,
      icon: CheckSquare,
      title: "8. Vacancy Allocation",
      desc: "Automated quota allocation matching candidates to UR merit and category-reserved slots (SC, ST, OBC, EWS, PwBD) according to official roster rules."
    },
    {
      id: 9,
      icon: ShieldAlert,
      title: "9. Audit Trails & Manipulation Detection",
      desc: "Comprehensive event logs tracking actor, role, action, and before/after diffs with automated heuristic alerts for unauthorized changes or duplicate uploads."
    },
    {
      id: 10,
      icon: MessageSquare,
      title: "10. Employee Notifications & Appeals",
      desc: "Instant receipt generation, provisional seniority list visibility, and statutory grievance appeal tracking with formal speaking order documentation."
    },
    {
      id: 11,
      icon: BarChart3,
      title: "11. Reports & Administrative Dashboards",
      desc: "Real-time cadre summaries, verification backlog counts, vacancy filling ratios, and exportable audit registries for ministry oversight."
    },
    {
      id: 12,
      icon: LockKeyhole,
      title: "12. System Security & Access Control",
      desc: "Strict role-based access control (RBAC), separation of duties between admin and committee members, and data protection safeguards."
    }
  ];

  return (
    <section id="modules" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <span>Modular Enterprise Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            Comprehensive Platform Modules
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            FairGov AI unites all facets of establishment governance into twelve cohesive, auditable modules designed to operate independently or as an integrated workflow.
          </p>
        </div>

        {/* 12 Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="p-6 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all shadow-2xs group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-[#0f2942] text-[#0f2942] group-hover:text-teal-300 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
