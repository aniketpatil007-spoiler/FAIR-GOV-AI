import React, { useEffect, useState } from 'react';
import {
  Award, Send, CheckCircle2, Clock, FileCheck, Hash,
  AlertTriangle, Shield, X, Eye
} from 'lucide-react';
import { fetchApplications, fetchVacancies, fetchEmployees, submitApplication } from '../../api/client';
import { PromotionApplication, VacancyNotice, Employee, UserPersona } from '../../types';

interface DemoApplicationsProps {
  currentPersona: UserPersona;
  onNavigateTab: (tab: string) => void;
}

export const DemoApplications: React.FC<DemoApplicationsProps> = ({ currentPersona, onNavigateTab }) => {
  const [applications, setApplications] = useState<PromotionApplication[]>([]);
  const [vacancies, setVacancies] = useState<VacancyNotice[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PromotionApplication | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Apply Form State
  const [applyVacId, setApplyVacId] = useState<number>(1);
  const [applyEmpId, setApplyEmpId] = useState<number>(3); // Default to Aniket Sharma
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apps, vacs, emps] = await Promise.all([
        fetchApplications(),
        fetchVacancies(),
        fetchEmployees()
      ]);
      setApplications(apps);
      setVacancies(vacs);
      setEmployees(emps);
      if (vacs.length > 0) setApplyVacId(vacs[0].id);
      if (emps.length > 0) setApplyEmpId(emps[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError(null);
    try {
      const newApp = await submitApplication(applyVacId, applyEmpId);
      setShowApplyModal(false);
      setSelectedApp(newApp);
      setShowReceiptModal(true);
      loadData();
    } catch (err: any) {
      setApplyError(err.message || 'Failed to submit promotion application');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ELIGIBLE</span>;
      case 'INELIGIBLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">INELIGIBLE</span>;
      case 'REQUIRES_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">DPC REVIEW (SEALED COVER)</span>;
      case 'ALLOCATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">ALLOCATED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">SUBMITTED</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] tracking-tight">
            Promotion Applications & Receipts
          </h2>
          <p className="text-xs text-slate-500">
            Submit applications against active vacancy notices and verify cryptographic submission receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#0f2942] hover:bg-[#153a5c] text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-teal-400" />
            <span>Submit Application</span>
          </button>
          <button
            onClick={() => onNavigateTab('rules')}
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Evaluate in Rules Engine</span>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4">Application No.</th>
              <th className="py-3 px-4">Candidate Officer</th>
              <th className="py-3 px-4">Vacancy Target</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Submission Date</th>
              <th className="py-3 px-4">Eligibility Status</th>
              <th className="py-3 px-4">Provisional Rank</th>
              <th className="py-3 px-4 text-right">Official Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  {loading ? 'Loading applications...' : 'No applications submitted.'}
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const emp = employees.find(e => e.id === app.employee_id);
                const vac = vacancies.find(v => v.id === app.vacancy_notice_id);
                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {app.application_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{emp ? emp.full_name : `Emp #${app.employee_id}`}</div>
                      <div className="text-[10px] text-slate-500">{emp ? `${emp.designation} (${emp.employee_ref})` : '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {vac ? vac.target_designation : `Notice #${app.vacancy_notice_id}`}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {emp ? emp.category : 'UR'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-slate-500">
                      {new Date(app.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {app.provisional_rank ? `#${app.provisional_rank}` : 'Pending DPC'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => { setSelectedApp(app); setShowReceiptModal(true); }}
                        className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Official Receipt Modal */}
      {showReceiptModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#0f2942] text-teal-400 flex items-center justify-center font-bold text-xs">
                  GOV
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official Promotion Application Receipt
                  </h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Government of India Establishment Section
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500">Application Number:</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.application_number}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500">Candidate Officer:</span>
                <span className="font-semibold text-slate-900">
                  {employees.find(e => e.id === selectedApp.employee_id)?.full_name || `Emp #${selectedApp.employee_id}`}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500">Submission Timestamp:</span>
                <span className="font-mono text-slate-800">{new Date(selectedApp.submitted_at).toLocaleString()}</span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-slate-500 block">Cryptographic Verifiable Receipt Hash:</span>
                <p className="font-mono text-[11px] text-teal-800 bg-white p-2 rounded border border-slate-200 break-all select-all">
                  {selectedApp.receipt_hash}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic text-center">
              *This cryptographic receipt token certifies authorized submission within the published deadline. Retain for all official establishment and DPC correspondence.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-[#0f2942] hover:bg-[#153a5c] text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Promotion Application
                </h3>
                <p className="text-xs text-slate-500">
                  Apply against an announced cadre vacancy round.
                </p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applyError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{applyError}</span>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Candidate Officer</label>
                <select
                  value={applyEmpId}
                  onChange={(e) => setApplyEmpId(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_ref} - {emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Vacancy Notice</label>
                <select
                  value={applyVacId}
                  onChange={(e) => setApplyVacId(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                >
                  {vacancies.map(vac => (
                    <option key={vac.id} value={vac.id}>
                      {vac.notice_code} — {vac.title} ({vac.total_vacancies} posts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[11px] leading-relaxed">
                By submitting, the system checks qualifying feeder service tenure, 5-year APAR benchmark averages, and vigilance status against applicable service rules.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Submitting & Generating Receipt...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
