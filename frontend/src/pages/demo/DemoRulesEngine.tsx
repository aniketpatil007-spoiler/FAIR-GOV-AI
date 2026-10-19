import React, { useEffect, useState } from 'react';
import {
  Scale, Play, CheckCircle2, AlertTriangle, XCircle, Calculator,
  FileText, Shield, Award, Users, ChevronRight, X, Info
} from 'lucide-react';
import {
  fetchRulesets, fetchVacancies, fetchApplications, fetchEmployees,
  evaluateVacancyApplications, explainDecision
} from '../../api/client';
import { PromotionRuleSet, VacancyNotice, PromotionApplication, Employee, UserPersona } from '../../types';

interface DemoRulesEngineProps {
  currentPersona: UserPersona;
  onNavigateTab: (tab: string) => void;
}

export const DemoRulesEngine: React.FC<DemoRulesEngineProps> = ({ currentPersona, onNavigateTab }) => {
  const [rulesets, setRulesets] = useState<PromotionRuleSet[]>([]);
  const [vacancies, setVacancies] = useState<VacancyNotice[]>([]);
  const [applications, setApplications] = useState<PromotionApplication[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationMessage, setEvaluationMessage] = useState<string | null>(null);

  // Explainability Modal State
  const [selectedExplainApp, setSelectedExplainApp] = useState<any | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [r, v, a, e] = await Promise.all([
        fetchRulesets(),
        fetchVacancies(),
        fetchApplications(),
        fetchEmployees()
      ]);
      setRulesets(r);
      setVacancies(v);
      setApplications(a);
      setEmployees(e);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunEvaluation = async () => {
    if (vacancies.length === 0) return;
    setEvaluating(true);
    setEvaluationMessage(null);
    try {
      const res = await evaluateVacancyApplications(
        vacancies[0].id,
        currentPersona.name,
        currentPersona.role
      );
      setEvaluationMessage(res.message);
      // Reload applications to reflect new ranks and allocated quotas
      const updatedApps = await fetchApplications(vacancies[0].id);
      setApplications(updatedApps);
    } catch (err: any) {
      alert(err.message || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const handleExplain = async (appId: number) => {
    setExplainLoading(true);
    try {
      const data = await explainDecision(appId);
      setSelectedExplainApp(data);
    } catch (err: any) {
      alert(err.message || 'Decision details not available. Run the rules engine first.');
    } finally {
      setExplainLoading(false);
    }
  };

  const activeRule = rulesets.length > 0 ? rulesets[0] : null;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] tracking-tight">
            Configurable Promotion Rules & Explainable Ranking Engine
          </h2>
          <p className="text-xs text-slate-500">
            Apply department-approved service rules, calculate transparent composite scores, and allocate quota slots.
          </p>
        </div>

        {/* Action Button: Run Evaluation */}
        <button
          onClick={handleRunEvaluation}
          disabled={evaluating}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide shadow-sm disabled:opacity-50 transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{evaluating ? 'Evaluating Candidates...' : 'Run Rules Engine & Rank Candidates'}</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {evaluationMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{evaluationMessage}</span>
          </div>
          <button
            onClick={() => setEvaluationMessage(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Promotion Rule Set Card */}
      {activeRule && (
        <div className="p-6 rounded-2xl bg-[#0f2942] text-white space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold tracking-tight text-white">
                Active Statutory Promotion Norms ({activeRule.version})
              </h3>
            </div>
            <span className="font-mono text-xs text-teal-300">
              Ref: {activeRule.official_reference}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block mb-0.5">Feeder → Target Post</span>
              <span className="font-semibold text-white">{activeRule.feeder_designation} → {activeRule.target_designation}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block mb-0.5">Min Qualifying Service</span>
              <span className="font-semibold text-white">≥ {activeRule.min_years_qualifying_service} Years in Grade</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block mb-0.5">APAR Benchmark Cutoff</span>
              <span className="font-semibold text-white">≥ {activeRule.apar_benchmark} / 5.0 ("Very Good")</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80">
              <span className="text-slate-400 block mb-0.5">Scoring Weightage</span>
              <span className="font-semibold text-white">{activeRule.seniority_weight}% Seniority / {activeRule.merit_apar_weight}% Merit</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 flex items-center gap-2">
            <span className="font-semibold text-teal-400">Statutory Tie-Breaker Hierarchy:</span>
            <span>1. Earlier date of appointment in feeder post → 2. Older date of birth</span>
          </div>
        </div>
      )}

      {/* Provisional Leaderboard & Quota Allocations Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Provisional Merit & Allocation Leaderboard
          </h3>
          <span className="text-xs text-slate-500">
            Total Candidates: {applications.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Candidate Officer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Service Tenure</th>
                <th className="py-3 px-4">APAR Benchmark</th>
                <th className="py-3 px-4">Composite Score</th>
                <th className="py-3 px-4">Eligibility Status</th>
                <th className="py-3 px-4">Allocated Quota</th>
                <th className="py-3 px-4 text-right">Explain Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No applications evaluated yet. Click "Run Rules Engine & Rank Candidates" above.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const emp = employees.find(e => e.id === app.employee_id);
                  const isAllocated = app.is_allocated;
                  return (
                    <tr key={app.id} className={`hover:bg-slate-50/80 transition-colors ${
                      isAllocated ? 'bg-teal-50/20' : ''
                    }`}>
                      <td className="py-3 px-4 font-mono font-bold text-base text-slate-900 whitespace-nowrap">
                        {app.provisional_rank ? `#${app.provisional_rank}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{emp ? emp.full_name : `Emp #${app.employee_id}`}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{emp ? emp.employee_ref : '—'}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {emp ? emp.category : 'UR'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {app.service_years_calculated ? `${app.service_years_calculated.toFixed(1)} yrs` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {emp?.apar_scores?.average ? `${emp.apar_scores.average.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-teal-800 text-sm">
                        {app.composite_score ? `${app.composite_score.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {app.status === 'ELIGIBLE' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ELIGIBLE
                          </span>
                        )}
                        {app.status === 'INELIGIBLE' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            INELIGIBLE
                          </span>
                        )}
                        {app.status === 'REQUIRES_REVIEW' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            SEALED COVER (REVIEW)
                          </span>
                        )}
                        {app.status === 'SUBMITTED' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            SUBMITTED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {app.allocated_quota ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                            {app.allocated_quota}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            {app.status === 'ELIGIBLE' ? 'Waitlist (Unallocated)' : 'Not Eligible'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleExplain(app.id)}
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Explain Decision</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Explainability Modal */}
      {selectedExplainApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedExplainApp.application_number}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Transparent Decision Explanation: {selectedExplainApp.employee_name}
                </h3>
                <p className="text-xs text-slate-500">
                  Cadre Ref: {selectedExplainApp.employee_ref} • Social Category: {selectedExplainApp.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedExplainApp(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Verdict Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              selectedExplainApp.status === 'ELIGIBLE'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : selectedExplainApp.status === 'REQUIRES_REVIEW'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <Scale className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-sm block">
                  Eligibility Finding: {selectedExplainApp.status} (Provisional Rank: #{selectedExplainApp.provisional_rank || 'N/A'})
                </span>
                <p>{selectedExplainApp.evaluation_details?.status_summary}</p>
                {selectedExplainApp.allocated_quota && (
                  <div className="font-semibold text-teal-800 pt-1">
                    Allocated Vacancy Slot: {selectedExplainApp.allocated_quota}
                  </div>
                )}
              </div>
            </div>

            {/* Criteria Checklist Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Statutory Criteria Scrutiny Checklist
              </h4>
              <div className="space-y-2">
                {selectedExplainApp.evaluation_details?.criteria_breakdown?.map((crit: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{crit.criterion}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        crit.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : crit.status === 'REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {crit.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Required: {crit.rule_requirement} • Candidate Record: <strong className="text-slate-700">{crit.candidate_actual}</strong>
                    </div>
                    <p className="text-slate-600 text-[11px] pt-0.5">{crit.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mathematical Formula Substitution */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs font-mono">
              <span className="font-bold text-teal-300 block font-sans">
                Mathematical Composite Score Formula Breakdown:
              </span>
              <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-200">
                {selectedExplainApp.evaluation_details?.formula_explanation}
              </pre>
            </div>

            {/* Official Rule Reference */}
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">Official Statutory Authority:</span>
              <p>{selectedExplainApp.evaluation_details?.official_rule_reference}</p>
              <div className="text-[10px] font-mono text-slate-500 pt-1">
                Application Receipt Checksum: {selectedExplainApp.receipt_hash}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                onClick={() => onNavigateTab('appeals')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                File Representation / Grievance Appeal
              </button>
              <button
                onClick={() => setSelectedExplainApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Explanation
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
