import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, Puzzle } from 'lucide-react';

export const SecurityPrivacy: React.FC = () => {
  const controls = [
    {
      category: "Authentication & Identity",
      control: "Role-Based Access Control (RBAC)",
      description: "Least-privilege authorization matrix separating Employee, Verifier, HR, Committee, and Admin roles.",
      status: "Implemented"
    },
    {
      category: "Authentication & Identity",
      control: "Single Sign-On (Parichay / Jan Parichay)",
      description: "OIDC/SAML integration with Government of India national single sign-on infrastructure.",
      status: "Requires Integration"
    },
    {
      category: "Data Integrity & Tamper Safeguards",
      control: "SHA-256 Checksum Validation",
      description: "Cryptographic digest calculated for all uploaded service books, dossiers, and credentials.",
      status: "Implemented"
    },
    {
      category: "Data Integrity & Tamper Safeguards",
      control: "Duplicate Document Detection",
      description: "Automated scan across the repository alerting verifiers if identical checksums are reused.",
      status: "Implemented"
    },
    {
      category: "Audit & Anomaly Monitoring",
      control: "Pre/Post State Diff Event Logging",
      description: "Audit trail recording actor, role, timestamp, entity, and exact diffs for all data mutations.",
      status: "Implemented"
    },
    {
      category: "Audit & Anomaly Monitoring",
      control: "Heuristic Risk Flags",
      description: "Automatic alerts for sensitive modifications (e.g., altered vacancy quotas post-publication).",
      status: "Implemented"
    },
    {
      category: "File Storage & Malware Defense",
      control: "File Size & MIME Type Whitelisting",
      description: "Enforcement of 15MB file caps and PDF/image formats to mitigate denial of service and file spoofing.",
      status: "Implemented"
    },
    {
      category: "File Storage & Malware Defense",
      control: "Automated ClamAV / Malware Pipeline",
      description: "Asynchronous stream scanning of uploaded files before moving to private storage vault.",
      status: "Planned"
    },
    {
      category: "Encryption & Network Security",
      control: "TLS 1.3 In-Transit Encryption",
      description: "Enforced HTTPS encryption for all browser-to-server and inter-service communications.",
      status: "Implemented"
    },
    {
      category: "Encryption & Network Security",
      control: "State Data Centre / NIC Cloud VPC Peering",
      description: "Deployment on MeitY-empanelled cloud or isolated government State Data Centre (SDC).",
      status: "Requires Integration"
    },
    {
      category: "Privacy & Data Minimization",
      control: "Deterministic Salted Identity Hashes",
      description: "Detects potential duplicate employee accounts without storing or exposing cleartext national IDs.",
      status: "Implemented"
    },
    {
      category: "Privacy & Data Minimization",
      control: "Formal Data Retention & Deletion Schedule",
      description: "Automated purging of obsolete application drafts and dispute archives per Public Records Act.",
      status: "Planned"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Implemented':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Implemented in Prototype
          </span>
        );
      case 'Planned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-600" />
            Planned for Phase 2
          </span>
        );
      case 'Requires Integration':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Puzzle className="w-3 h-3 text-amber-600" />
            Requires Dept Integration
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="security" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span>Security & Compliance Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            Proposed Security & Privacy Controls
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            In accordance with government procurement transparency standards, all technical controls are explicitly categorized by their current implementation status.
          </p>
        </div>

        {/* Security Controls Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Control Specification</th>
                <th className="py-3.5 px-4">Operational Architecture</th>
                <th className="py-3.5 px-4">Readiness Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {controls.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {c.category}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {c.control}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                    {c.description}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(c.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
