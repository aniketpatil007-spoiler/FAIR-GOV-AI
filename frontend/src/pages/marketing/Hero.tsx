import React from 'react';
import { Shield, Sparkles, CheckCircle, ArrowRight, FileCheck, Users, Scale, FileSpreadsheet, Lock } from 'lucide-react';

interface HeroProps {
  onLaunchDemo: () => void;
  onRequestDemo: () => void;
  onExploreModules: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchDemo, onRequestDemo, onExploreModules }) => {
  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0f2942_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Target Audience Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>Designed for Indian Central & State Government Cadres</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f2942] tracking-tight leading-tight">
            Less Paperwork. Clearer Decisions.{' '}
            <span className="text-teal-700 underline decoration-teal-400 decoration-wavy decoration-2">
              Accountable Governance.
            </span>
          </h1>

          {/* Lead Paragraph */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            A transparent, auditable employee-records and promotion-management platform. Streamline service records, automate document verification, apply approved rules consistently, and produce explainable candidate rankings with verifiable audit trails.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0f2942] hover:bg-[#153a5c] text-white px-6 py-3 rounded-lg text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              Explore Interactive Demo App
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={onRequestDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-6 py-3 rounded-lg text-sm font-semibold border border-slate-300 shadow-2xs transition-all"
            >
              Request a Demonstration
            </button>
          </div>

          {/* Credibility highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Version-Controlled Service Rules
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Cryptographic SHA-256 File Hashes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Separation of Role Duties
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              No Human Discretion Bypassed
            </span>
          </div>
        </div>

        {/* Feature Snapshot Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Verified Employee Dossiers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidated digital service records with automated duplicate detection, file integrity hashing, and timestamped verifier rationale.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Transparent Promotion Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configurable evaluation against official service guidelines (DoPT OMs, APAR benchmark thresholds, and quota rosters) with full explainability.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Auditable Integrity Safeguards
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Granular change logs capture before/after states, prevent silent score edits, and trigger automated alerts on post-publication anomalies.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
