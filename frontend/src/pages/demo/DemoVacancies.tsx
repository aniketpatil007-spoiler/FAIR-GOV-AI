import React, { useEffect, useState } from 'react';
import {
  Building, Plus, Edit3, AlertTriangle, CheckCircle2, History,
  FileText, Users, X, Info
} from 'lucide-react';
import { fetchVacancies, createVacancy, updateVacancy } from '../../api/client';
import { VacancyNotice, UserPersona } from '../../types';

interface DemoVacanciesProps {
  currentPersona: UserPersona;
}

export const DemoVacancies: React.FC<DemoVacanciesProps> = ({ currentPersona }) => {
  const [vacancies, setVacancies] = useState<VacancyNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVac, setSelectedVac] = useState<VacancyNotice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  // Create Form State
  const [newVac, setNewVac] = useState({
    title: 'Annual Promotion Round 2024 - Under Secretary (CSS Cadre)',
    target_cadre: 'Central Secretariat Service (CSS)',
    target_designation: 'Under Secretary',
    target_pay_level: 11,
    feeder_designation: 'Section Officer',
    total_vacancies: 6,
    breakdown_ur: 4,
    breakdown_sc: 1,
    breakdown_st: 1,
    breakdown_obc: 0,
    breakdown_ews: 0,
    breakdown_pwbd: 0,
    vacancy_causes: { "retirement": 3, "promotion_outflow": 2, "deputation_reserve": 1 },
    sanctioned_reconciliation: 'Sanctioned Strength: 140 | In-Position: 134 | Net Vacancies for DPC: 6',
    application_deadline: '2024-12-31'
  });

  // Edit/Publish Form State
  const [editData, setEditData] = useState({
    title: '',
    total_vacancies: 0,
    status: 'PUBLISHED',
    revision_reason: ''
  });

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      setLoading(true);
      const data = await fetchVacancies();
      setVacancies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVacancy(newVac, currentPersona.name, currentPersona.role);
      setShowCreateModal(false);
      loadVacancies();
    } catch (err: any) {
      alert(err.message || 'Error creating vacancy notice');
    }
  };

  const handleOpenEdit = (v: VacancyNotice) => {
    setSelectedVac(v);
    setEditData({
      title: v.title,
      total_vacancies: v.total_vacancies,
      status: v.status === 'DRAFT' ? 'PUBLISHED' : v.status,
      revision_reason: ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVac) return;
    try {
      await updateVacancy(
        selectedVac.id,
        editData,
        currentPersona.name,
        currentPersona.role
      );
      setShowEditModal(false);
      loadVacancies();
    } catch (err: any) {
      alert(err.message || 'Error updating vacancy notice');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] tracking-tight">
            Cadre Vacancy Management & Reconciliation
          </h2>
          <p className="text-xs text-slate-500">
            Reconcile sanctioned post registers, track vacancy causes (retirement, promotion), and audit quota revisions.
          </p>
        </div>

        {['HR Officer', 'Department Admin', 'System Administrator'].includes(currentPersona.role) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#0f2942] hover:bg-[#153a5c] text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Create Draft Vacancy Notice</span>
          </button>
        )}
      </div>

      {/* Vacancy Notices Grid */}
      <div className="grid grid-cols-1 gap-6">
        {vacancies.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            {loading ? 'Loading vacancy notices...' : 'No vacancy notices found.'}
          </div>
        ) : (
          vacancies.map((v) => (
            <div
              key={v.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {v.notice_code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      v.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {v.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Revision: r{v.revision_count}.0
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cadre: <strong>{v.target_cadre}</strong> • Feeder Post: <strong>{v.feeder_designation}</strong> → Target Post: <strong>{v.target_designation} (Level {v.target_pay_level})</strong>
                  </p>
                </div>

                {['HR Officer', 'Department Admin', 'System Administrator'].includes(currentPersona.role) && (
                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{v.status === 'DRAFT' ? 'Publish Notice' : 'Revise Vacancy Count'}</span>
                  </button>
                )}
              </div>

              {/* Sanctioned Reconciliation Banner */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono flex items-center justify-between flex-wrap gap-2">
                <span>Sanction Reconciliation: <strong>{v.sanctioned_reconciliation || 'Reconciled with Section Cadre Register'}</strong></span>
                <span className="text-teal-800 font-bold">Total DPC Vacancies: {v.total_vacancies}</span>
              </div>

              {/* Quota Breakdown & Causes Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Quota reservation points */}
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Reservation Quota Distribution</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800">UR (Unreserved): {v.breakdown_ur}</span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800">SC: {v.breakdown_sc}</span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800">ST: {v.breakdown_st}</span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800">OBC: {v.breakdown_obc}</span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800">EWS: {v.breakdown_ews}</span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-semibold text-slate-800">PwBD: {v.breakdown_pwbd}</span>
                  </div>
                </div>

                {/* Causes Breakdown */}
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Attributed Vacancy Causes</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(v.vacancy_causes || {}).map(([cause, count]) => (
                      <span key={cause} className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 capitalize font-medium">
                        {cause.replace(/_/g, ' ')}: <strong>{count}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revision history button */}
              {v.revision_notes && v.revision_notes.length > 0 && (
                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                  <span className="italic">Authorized by: {v.created_by}</span>
                  <button
                    onClick={() => { setSelectedVac(v); setShowRevisionModal(true); }}
                    className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>View Revisions Log ({v.revision_notes.length})</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Revision History Modal */}
      {showRevisionModal && selectedVac && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Vacancy Notice Revision History
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedVac.notice_code}
                </p>
              </div>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {selectedVac.revision_notes.map((rev, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{rev.actor || 'Establishment Section'}</span>
                    <span className="font-mono">{new Date(rev.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-800 font-medium">{rev.note}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Revise Vacancy Modal */}
      {showEditModal && selectedVac && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedVac.status === 'DRAFT' ? 'Publish Vacancy Notice' : 'Revise Vacancy Count'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedVac.notice_code}
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedVac.status === 'PUBLISHED' && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Sensitive Modification:</strong> Altering vacancy figures after publication will automatically be logged with an integrity risk alert in the audit trail.
                </span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Vacancies</label>
                <input
                  type="number"
                  min={1}
                  value={editData.total_vacancies}
                  onChange={(e) => setEditData({ ...editData, total_vacancies: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Publication Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED (Active for Applications)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mandatory Revision Justification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editData.revision_reason}
                  onChange={(e) => setEditData({ ...editData, revision_reason: e.target.value })}
                  placeholder="State official reason (e.g. Additional vacancy due to superannuation order dated 14/03/2024)..."
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold"
                >
                  Save Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Vacancy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create Draft Vacancy Notice
                </h3>
                <p className="text-xs text-slate-500">
                  Configure cadre quota points and sanctioned strength reconciliation.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={newVac.title}
                    onChange={(e) => setNewVac({ ...newVac, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Cadre</label>
                  <input
                    type="text"
                    required
                    value={newVac.target_cadre}
                    onChange={(e) => setNewVac({ ...newVac, target_cadre: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Promotion Designation</label>
                  <input
                    type="text"
                    required
                    value={newVac.target_designation}
                    onChange={(e) => setNewVac({ ...newVac, target_designation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Feeder Designation</label>
                  <input
                    type="text"
                    required
                    value={newVac.feeder_designation}
                    onChange={(e) => setNewVac({ ...newVac, feeder_designation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Vacancies</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newVac.total_vacancies}
                    onChange={(e) => setNewVac({ ...newVac, total_vacancies: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Sanctioned Cadre Reconciliation Text</label>
                  <input
                    type="text"
                    value={newVac.sanctioned_reconciliation}
                    onChange={(e) => setNewVac({ ...newVac, sanctioned_reconciliation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold"
                >
                  Create Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
