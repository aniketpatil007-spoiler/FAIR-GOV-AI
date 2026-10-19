import React, { useEffect, useState } from 'react';
import {
  Users, Search, Plus, Filter, AlertTriangle, CheckCircle2,
  FileEdit, ShieldAlert, History, ChevronRight, X
} from 'lucide-react';
import { fetchEmployees, createEmployee, requestCorrection } from '../../api/client';
import { Employee, UserPersona } from '../../types';

interface DemoEmployeesProps {
  currentPersona: UserPersona;
}

export const DemoEmployees: React.FC<DemoEmployeesProps> = ({ currentPersona }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // New Employee Form State
  const [newEmpData, setNewEmpData] = useState({
    full_name: '',
    email: '',
    department: 'Department of Personnel & Training',
    designation: 'Section Officer',
    cadre: 'Central Secretariat Service (CSS)',
    joining_date: '2018-06-01',
    dob: '1988-05-15',
    category: 'UR',
    pay_level: 8,
    apar_scores: { "average": 4.70 },
    vigilance_status: 'CLEAR',
    service_status: 'ACTIVE'
  });
  const [addError, setAddError] = useState<string | null>(null);

  // Correction Form State
  const [correctionData, setCorrectionData] = useState({
    field_name: 'department',
    current_value: '',
    requested_value: '',
    reason: ''
  });
  const [corrSuccess, setCorrSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, [search, selectedDept]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees(search, selectedDept);
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    try {
      await createEmployee(newEmpData, currentPersona.name, currentPersona.role);
      setShowAddModal(false);
      loadEmployees();
    } catch (err: any) {
      setAddError(err.message || 'Failed to create employee profile');
    }
  };

  const handleOpenCorrection = (emp: Employee) => {
    setSelectedEmployee(emp);
    setCorrectionData({
      field_name: 'department',
      current_value: emp.department,
      requested_value: '',
      reason: ''
    });
    setCorrSuccess(null);
    setShowCorrectionModal(true);
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    try {
      await requestCorrection(selectedEmployee.id, correctionData);
      setCorrSuccess('Correction request successfully submitted for establishment review.');
      setTimeout(() => {
        setShowCorrectionModal(false);
        setCorrSuccess(null);
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Error submitting correction request');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] tracking-tight">
            Employee Cadre Records
          </h2>
          <p className="text-xs text-slate-500">
            Search, verify, and maintain official service histories, APAR averages, and vigilance clearances.
          </p>
        </div>

        {/* Action button if role has establishment permissions */}
        {['HR Officer', 'Department Admin', 'System Administrator'].includes(currentPersona.role) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#0f2942] hover:bg-[#153a5c] text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Create Employee Profile</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate name, employee ref (e.g. GOV-CSS-2018...), or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white text-slate-700"
        >
          <option value="">All Cadre Ministries</option>
          <option value="Personnel">DoPT</option>
          <option value="Home">Home Affairs</option>
          <option value="Finance">Finance</option>
          <option value="Commerce">Commerce</option>
          <option value="Social">Social Justice</option>
          <option value="External">External Affairs</option>
        </select>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4">Employee Ref</th>
              <th className="py-3 px-4">Officer Name</th>
              <th className="py-3 px-4">Ministry / Department</th>
              <th className="py-3 px-4">Feeder Designation</th>
              <th className="py-3 px-4">Joining Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">APAR Benchmark</th>
              <th className="py-3 px-4">Vigilance</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  {loading ? 'Loading employee records...' : 'No matching employee records found.'}
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-teal-800 whitespace-nowrap">
                    {emp.employee_ref}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {emp.full_name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {emp.department}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {emp.designation} (Lvl {emp.pay_level})
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                    {emp.joining_date}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {emp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {emp.apar_scores?.average ? `${emp.apar_scores.average.toFixed(2)} / 5.0` : '—'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {emp.vigilance_status === 'CLEAR' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        CLEAR
                      </span>
                    ) : emp.vigilance_status === 'PENDING_INQUIRY' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        PENDING INQUIRY
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        ADVERSE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-teal-700 hover:text-teal-900 font-semibold"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleOpenCorrection(emp)}
                      className="text-slate-500 hover:text-slate-800"
                      title="Request Correction"
                    >
                      <FileEdit className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && !showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedEmployee.employee_ref}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedEmployee.full_name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedEmployee.designation} — {selectedEmployee.department}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Cadre Stream</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.cadre}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Appointment Date</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.joining_date}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Pay Level (7th CPC)</span>
                <span className="font-semibold text-slate-900">Level {selectedEmployee.pay_level}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Social Category</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.category}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                <span className="font-semibold text-slate-900">{selectedEmployee.dob}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-0.5">Record Version</span>
                <span className="font-semibold text-slate-900">v{selectedEmployee.record_version}.0</span>
              </div>
            </div>

            {/* APAR Score History */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">APAR Annual Grading History</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedEmployee.apar_scores || {}).map(([year, score]) => (
                  <div key={year} className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
                    <span className="text-slate-400 font-mono text-[10px] mr-1">{year}:</span>
                    <strong className="text-slate-900">{Number(score).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Salted Identity Hash for Duplicate Detection */}
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
              <span className="text-slate-500 font-sans font-semibold block">Salted Identity Duplicate Check Token:</span>
              <p className="truncate text-teal-800">{selectedEmployee.identity_hash || 'Calculated on creation'}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleOpenCorrection(selectedEmployee)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Submit Service Record Correction Request</span>
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction Request Modal */}
      {showCorrectionModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Service Record Correction
                </h3>
                <p className="text-xs text-slate-500">
                  Officer: {selectedEmployee.full_name} ({selectedEmployee.employee_ref})
                </p>
              </div>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {corrSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{corrSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitCorrection} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Field to Correct</label>
                  <select
                    value={correctionData.field_name}
                    onChange={(e) => {
                      const field = e.target.value;
                      setCorrectionData({
                        ...correctionData,
                        field_name: field,
                        current_value: String((selectedEmployee as any)[field] || '')
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="department">Department</option>
                    <option value="designation">Designation</option>
                    <option value="cadre">Cadre</option>
                    <option value="pay_level">Pay Level</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Recorded Value</label>
                  <input
                    type="text"
                    disabled
                    value={correctionData.current_value}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-100 text-slate-600 border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Correct Value</label>
                  <input
                    type="text"
                    required
                    value={correctionData.requested_value}
                    onChange={(e) => setCorrectionData({ ...correctionData, requested_value: e.target.value })}
                    placeholder="Enter revised official text/value"
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason / Supporting Office Order Reference</label>
                  <textarea
                    rows={3}
                    required
                    value={correctionData.reason}
                    onChange={(e) => setCorrectionData({ ...correctionData, reason: e.target.value })}
                    placeholder="Cite administrative office order, gazette notification, or transfer order..."
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create New Feeder Employee Record
                </h3>
                <p className="text-xs text-slate-500">
                  Adds candidate profile with automated duplicate identity check.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpData.full_name}
                    onChange={(e) => setNewEmpData({ ...newEmpData, full_name: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={newEmpData.email}
                    onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })}
                    placeholder="ramesh.chandra.demo@gov.in"
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ministry / Department</label>
                  <input
                    type="text"
                    required
                    value={newEmpData.department}
                    onChange={(e) => setNewEmpData({ ...newEmpData, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Feeder Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmpData.designation}
                    onChange={(e) => setNewEmpData({ ...newEmpData, designation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Joining Date in Feeder Grade</label>
                  <input
                    type="date"
                    required
                    value={newEmpData.joining_date}
                    onChange={(e) => setNewEmpData({ ...newEmpData, joining_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={newEmpData.dob}
                    onChange={(e) => setNewEmpData({ ...newEmpData, dob: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Social Category</label>
                  <select
                    value={newEmpData.category}
                    onChange={(e) => setNewEmpData({ ...newEmpData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  >
                    <option value="UR">UR (Unreserved)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="OBC">OBC</option>
                    <option value="EWS">EWS</option>
                    <option value="PwBD">PwBD</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vigilance Status</label>
                  <select
                    value={newEmpData.vigilance_status}
                    onChange={(e) => setNewEmpData({ ...newEmpData, vigilance_status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg border-slate-300"
                  >
                    <option value="CLEAR">CLEAR</option>
                    <option value="PENDING_INQUIRY">PENDING_INQUIRY</option>
                    <option value="ADVERSE">ADVERSE</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
