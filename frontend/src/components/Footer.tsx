import React from 'react';
import { Shield, FileText, Lock, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1d30] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Product Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-teal-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">FairGov AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, auditable government employee-records, vacancy reconciliation, and promotion-management platform designed for controlled departmental evaluation and pilots.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700 text-[11px] text-teal-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Designed for Central & State Depts
              </div>
            </div>
          </div>

          {/* Column 2: Governance & Service Rules */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Governance & Frameworks
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-white transition-colors">DoPT Office Memorandums Aligned</li>
              <li className="hover:text-white transition-colors">Central Civil Services (CCS) Rules Model</li>
              <li className="hover:text-white transition-colors">Post-Based Roster Reservation Engine</li>
              <li className="hover:text-white transition-colors">Departmental Promotion Committee (DPC) Workflow</li>
              <li className="hover:text-white transition-colors">Cryptographic SHA-256 Service Dossier Hashes</li>
              <li className="hover:text-white transition-colors">Separation of Duties & Least Privilege Access</li>
            </ul>
          </div>

          {/* Column 3: Platform Safeguards */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Safeguards & Audit
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-white transition-colors">Immutable-style Audit Trail Recording</li>
              <li className="hover:text-white transition-colors">Automated Heuristic Anomaly Flags</li>
              <li className="hover:text-white transition-colors">Duplicate Identity & File Detection</li>
              <li className="hover:text-white transition-colors">Pre/Post Value Change Difference Capture</li>
              <li className="hover:text-white transition-colors">Statutory Grievance & Speaking Orders</li>
              <li className="hover:text-white transition-colors">Controlled Air-Gapped / SDC Hosting Ready</li>
            </ul>
          </div>

          {/* Column 4: Controlled Pilot Proposal */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Department Evaluation
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              We propose beginning with a single administrative cadre or section using synthetic or authorized records and department-approved promotion rules.
            </p>
            <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-teal-300 block">Pilot Consultation</span>
              <p className="text-[11px] text-slate-400">Zero disruption parallel testing against existing physical or legacy workflows.</p>
            </div>
          </div>
        </div>

        {/* Legal & Regulatory Grounding Disclaimer */}
        <div className="pt-8 space-y-4">
          <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block mb-1">
                Notice of Prototype Status & Non-Affiliation
              </span>
              FairGov AI is a proposed GovTech software platform designed for demonstration, technical evaluation, and controlled pilot proposals. It does not claim formal certification, empanelment, approval, or deployment by the Government of India or any state government until independently reviewed and procured under applicable rules (e.g. GeM / GFR). All employee identities, service books, and vacancy figures depicted in this demonstration are synthetic and fictional.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/60 gap-4">
            <div>
              © 2026 FairGov AI Project Initiative. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>National Informatics Standards Aligned</span>
              <span>Accessibility (GIGW 3.0 Compliance Target)</span>
              <span>Privacy By Design</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
