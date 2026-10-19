import React, { useEffect, useState } from 'react';
import {
  HelpCircle, Plus, CheckCircle2, XCircle, Clock,
  FileText, Scale, X, MessageSquare
} from 'lucide-react';
import { fetchAppeals, fileAppeal, reviewAppeal, fetchApplications, fetchEmployees } from '../../api/client';
import { Appeal, PromotionApplication, Employee, UserPersona } from '../../types';

interface DemoAppealsProps {
  currentPersona: UserPersona;
}

export const DemoAppeals: React.FC<DemoAppealsProps> = ({ currentPersona }) => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [applications, setApplications] = useState<PromotionApplication[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // File Appeal State
  const [fileData, setFileData] = useState({
    application_id: 1,
    employee_id: 3,
    grievance_type: 'APAR_ASSESSMENT',
    description: '',
    supporting_doc_ref: ''
  });

  // Review Appeal State
  const [reviewData, setReviewData] = useState({
    decision: 'ALLOWED',
    speaking_order: '',
    disposal_order_number: 'DoPT/DPC/APL/2024/12'
  });
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apls, apps, emps] = await Promise.all([
        fetchAppeals(),
        fetchApplications(),
        fetchEmployees()
      ]);
      setAppeals(apls);
      setApplications(apps);
      setEmployees(emps);
      if (apps.length > 0) {
        setFileData(prev => ({
          ...prev,
          application_id: apps[0].id,
          employee_id: apps[0].employee_id
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fileAppeal(
        fileData.application_id,
        fileData.employee_id,
        fileData.grievance_type,
        fileData.description
      );
      setShowFileModal(false);
      setFileData({
        application_id: 1,
        employee_id: 3,
        grievance_type: 'APAR_ASSESSMENT',
        description: '',
        supporting_doc_ref: ''
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to file appeal');
    }
  };

  const handleOpenReview = (apl: Appeal) => {
    setSelectedAppeal(apl);
    setReviewData({
      decision: 'ALLOWED',
      speaking_order: 'Having examined the APAR assessment report and representation, the Competent Authority orders...',
      disposal_order_number: `DoPT/DPC/ORDER/${apl.id}/2024`
    });
    setShowReviewModal(true);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppeal) return;
    setReviewing(true);
    try {
      await reviewAppeal(
        selectedAppeal.id,
        reviewData.decision,
        reviewData.speaking_order,
        reviewData.disposal_order_number,
        currentPersona.name
      );
      setShowReviewModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to dispose appeal');
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ALLOWED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ALLOWED</span>;
      case 'DISMISSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">DISMISSED</span>;
      case 'UNDER_COMMITTEE_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">UNDER COMMITTEE HEARING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">PENDING HEARING</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] tracking-tight">
            Statutory Grievances & Appeals
          </h2>
          <p className="text-xs text-slate-500">
            Submit formal representations against provisional findings and review committee speaking orders.
          </p>
        </div>

        <button
          onClick={() => setShowFileModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#0f2942] hover:bg-[#153a5c] text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>File Representation / Appeal</span>
        </button>
      </div>

      {/* Appeals Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4">Appeal Number</th>
              <th className="py-3 px-4">Appellant Officer</th>
              <th className="py-3 px-4">Grievance Category</th>
              <th className="py-3 px-4">Grounds of Appeal</th>
              <th className="py-3 px-4">Filing Date</th>
              <th className="py-3 px-4">Disposal Status</th>
              <th className="py-3 px-4">Speaking Order</th>
              <th className="py-3 px-4 text-right">Committee Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {appeals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  {loading ? 'Loading appeals...' : 'No statutory appeals filed.'}
                </td>
              </tr>
            ) : (
              appeals.map((apl) => {
                const emp = employees.find(e => e.id === apl.employee_id);
                return (
                  <tr key={apl.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {apl.appeal_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{emp ? emp.full_name : `Emp #${apl.employee_id}`}</div>
                      <div className="text-[10px] text-slate-500">{emp ? emp.employee_ref : '—'}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                        {apl.grievance_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-700" title={apl.description}>
                      {apl.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-slate-500">
                      {new Date(apl.filed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(apl.status)}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600 font-mono" title={apl.speaking_order || 'Pending formal disposal'}>
                      {apl.disposal_order_number ? (
                        <span className="text-teal-800 font-semibold">{apl.disposal_order_number}</span>
                      ) : (
                        <span className="text-slate-400 italic">Pending Disposal</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {['Promotion Committee', 'Department Admin', 'System Administrator'].includes(currentPersona.role) ? (
                        <button
                          onClick={() => handleOpenReview(apl)}
                          className="text-teal-700 hover:text-teal-900 font-semibold"
                        >
                          {apl.status === 'ALLOWED' || apl.status === 'DISMISSED' ? 'View Order' : 'Review & Dispose'}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Restricted to Committee</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review & Issue Speaking Order Modal */}
      {showReviewModal && selectedAppeal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Dispose Appeal & Issue Speaking Order
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedAppeal.appeal_number}
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-slate-700 block">Appellant's Grounds:</span>
              <p className="text-slate-600">{selectedAppeal.description}</p>
            </div>

            <form onSubmit={handleReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Committee Disposal Finding</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, decision: 'ALLOWED' })}
                    className={`py-2 px-3 rounded-lg font-bold border text-center transition-all ${
                      reviewData.decision === 'ALLOWED'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ALLOWED (Grievance Upheld)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, decision: 'DISMISSED' })}
                    className={`py-2 px-3 rounded-lg font-bold border text-center transition-all ${
                      reviewData.decision === 'DISMISSED'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    DISMISSED (Finding Upheld)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Disposal Office Order Number</label>
                <input
                  type="text"
                  required
                  value={reviewData.disposal_order_number}
                  onChange={(e) => setReviewData({ ...reviewData, disposal_order_number: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Speaking Order Rationale & Findings <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewData.speaking_order}
                  onChange={(e) => setReviewData({ ...reviewData, speaking_order: e.target.value })}
                  placeholder="Record detailed speaking order explaining committee reasons, rule provisions applied, and directions..."
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewing}
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold disabled:opacity-50"
                >
                  {reviewing ? 'Recording Speaking Order...' : 'Issue Formal Disposal Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Appeal Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  File Statutory Representation / Grievance
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted for formal consideration by the Departmental Review Committee.
                </p>
              </div>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appellant Officer</label>
                <select
                  value={fileData.employee_id}
                  onChange={(e) => {
                    const empId = Number(e.target.value);
                    const app = applications.find(a => a.employee_id === empId);
                    setFileData({
                      ...fileData,
                      employee_id: empId,
                      application_id: app ? app.id : (applications[0]?.id || 1)
                    });
                  }}
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
                <label className="block font-semibold text-slate-700 mb-1">Grievance Category</label>
                <select
                  value={fileData.grievance_type}
                  onChange={(e) => setFileData({ ...fileData, grievance_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                >
                  <option value="APAR_ASSESSMENT">APAR Grading Assessment Dispute</option>
                  <option value="SENIORITY_DISPUTE">Inter-se Seniority List Calculation</option>
                  <option value="SERVICE_CALCULATION">Qualifying Service Period Shortfall</option>
                  <option value="DOCUMENT_VERIFICATION">Document Verification Rejection Dispute</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Grounds of Representation</label>
                <textarea
                  rows={4}
                  required
                  value={fileData.description}
                  onChange={(e) => setFileData({ ...fileData, description: e.target.value })}
                  placeholder="Detail official reasons, dates, references to past DPC orders, or factual corrections requested..."
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold"
                >
                  Submit Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
