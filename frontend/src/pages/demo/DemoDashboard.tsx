import React, { useEffect, useState } from 'react';
import {
  Users, FileCheck, AlertTriangle, Building, Award, ShieldAlert,
  Clock, ArrowUpRight, CheckCircle2, ShieldCheck, Activity
} from 'lucide-react';
import { fetchStats, fetchAuditEvents } from '../../api/client';
import { DashboardStats, AuditEvent, UserPersona } from '../../types';

interface DemoDashboardProps {
  currentPersona: UserPersona;
  onNavigateTab: (tab: string) => void;
}

export const DemoDashboard: React.FC<DemoDashboardProps> = ({ currentPersona, onNavigateTab }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAudits, setRecentAudits] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [s, a] = await Promise.all([
        fetchStats(),
        fetchAuditEvents(false)
      ]);
      setStats(s);
      setRecentAudits(a.slice(0, 6));
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Demonstration Banner & Role Welcome */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#0f2942] to-[#1e3a5f] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Active Evaluation Persona: {currentPersona.role}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Welcome, {currentPersona.name}
          </h2>
          <p className="text-xs text-slate-300">
            {currentPersona.designation} — {currentPersona.department}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="block font-semibold text-white">Controlled Pilot Prototype</span>
            <span className="text-[10px] text-amber-300">Demonstration Mode (Synthetic Data)</span>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Demo Employees */}
        <div
          onClick={() => onNavigateTab('employees')}
          className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-400 cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Demo Employees</span>
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0f2942]">
            {stats ? stats.total_demo_employees : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Central & Feeder Cadre</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Documents Awaiting Verification */}
        <div
          onClick={() => onNavigateTab('documents')}
          className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-400 cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Verifications</span>
            <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {stats ? stats.documents_awaiting_verification : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Requires Verifier Scrutiny</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Active Vacancy Notices */}
        <div
          onClick={() => onNavigateTab('vacancies')}
          className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-400 cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Vacancies</span>
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-700">
            {stats ? stats.active_vacancies : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Published DPC Rounds</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Flagged Audit Risks */}
        <div
          onClick={() => onNavigateTab('audit')}
          className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Integrity Risk Alerts</span>
            <div className="w-7 h-7 rounded bg-rose-50 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {stats ? stats.flagged_audit_risks : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Heuristic Anomaly Flags</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* Quick Action Walkthrough Shortcuts */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Recommended Pilot Demonstration Actions for Evaluators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button
            onClick={() => onNavigateTab('rules')}
            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-colors"
          >
            <div className="w-8 h-8 rounded bg-[#0f2942] text-teal-300 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Run Rules Engine</span>
              <span className="text-[11px] text-slate-500">Calculate scores & view mathematical explainability.</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('documents')}
            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-colors"
          >
            <div className="w-8 h-8 rounded bg-teal-600 text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Verify File Hashes</span>
              <span className="text-[11px] text-slate-500">Test SHA-256 duplicate detection and verifier audit notes.</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('audit')}
            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-colors"
          >
            <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Inspect Audit Trails</span>
              <span className="text-[11px] text-slate-500">View before/after value diffs and risk alerts.</span>
            </div>
          </button>

        </div>
      </div>

      {/* Recent Audit Stream */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Audit Trail Stream (Recent Events)
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('audit')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View Complete Log</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentAudits.map((ev) => (
            <div key={ev.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{ev.actor_name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                    {ev.actor_role}
                  </span>
                  <span className="font-mono text-slate-400 text-[10px]">
                    → {ev.action_type} on {ev.target_entity} ({ev.target_id})
                  </span>
                </div>
                {ev.is_flagged_risk && (
                  <div className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-medium">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Risk Alert: {ev.risk_reason}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
