import React from 'react';
import { Target, Compass, Award, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const AboutFairGov: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span>Project Mission & Ethics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            About the FairGov AI Initiative
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            FairGov AI is an applied GovTech research and development project focused on engineering trustworthy, verifiable software architecture for public administration.
          </p>
        </div>

        {/* Core Principles */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Responsible GovTech Engineering
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We design software that supports official human authority rather than subverting it. Automated logic is restricted to objective rule evaluation, data validation, and audit recording. Discretionary decisions, statutory exceptions, and appeal reviews remain strictly in the hands of authorized government officials.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Transparent Boundaries & Honesty
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We reject exaggerated AI claims. We do not claim that software can make bribery impossible or replace statutory promotion committees. Instead, we offer verifiable audit logs, clear mathematical explainability, role separation, and tamper-resistant workflows that significantly raise the barrier to unauthorized interference.
            </p>
          </div>
        </div>

        {/* Commitment box */}
        <div className="max-w-4xl mx-auto p-6 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-900 block">
            Commitment to Procurement Standards & Open Evaluation:
          </span>
          <p className="leading-relaxed">
            FairGov AI is developed in alignment with the Open Source Software policy of the Government of India, the National Data Sharing and Accessibility Policy (NDSAP), and GIGW 3.0 accessibility guidelines. We provide complete technical documentation, architecture specifications, and security threat models to assist departments during pre-procurement technical evaluations.
          </p>
        </div>

      </div>
    </section>
  );
};
