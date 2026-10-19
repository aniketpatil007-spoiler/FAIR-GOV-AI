import React, { useEffect, useState } from 'react';
import {
  ShieldAlert, Filter, Download, AlertTriangle, CheckCircle2,
  FileText, Clock, User, Eye, X, RefreshCw
} from 'lucide-react';
import { fetchAuditEvents } from '../../api/client';
import { AuditEvent, UserPersona } from '../../types';

interface DemoAuditProps {
  currentPersona: UserPersona;
}

export const DemoAudit: React.FC<DemoAuditProps> = ({ currentPersona }) => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskOnly, setRiskOnly] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  useEffect(() => {
    loadAudit();
  }, [riskOnly, selectedEntity]);

  const loadAudit = async () => {
    try {
      setLoading(true);
      const data = await fetchAuditEvents(riskOnly, selectedEntity || undefined);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(events, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `fairgov_audit_trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] tracking-tight">
            Immutable-Style Audit Trails & Anomaly Detection
          </h2>
          <p className="text-xs text-slate-500">
            Recorded change history with actor, role, timestamp, pre/post value differences, and automated risk alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAudit}
            className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
            title="Refresh Audit Log"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Audit Registry (JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setRiskOnly(!riskOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
              riskOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${riskOnly ? 'text-white' : 'text-rose-600'}`} />
            <span>Show Integrity Risk Alerts Only</span>
          </button>

          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">All Entities</option>
            <option value="EMPLOYEE">Employees</option>
            <option value="DOCUMENT">Documents</option>
            <option value="VACANCY">Vacancies</option>
            <option value="APPLICATION">Applications & DPC</option>
            <option value="APPEAL">Appeals</option>
            <option value="RULE">Rulesets</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong>{events.length}</strong> logged events
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Acting Officer</th>
              <th className="py-3 px-4">Role Permission</th>
              <th className="py-3 px-4">Operation</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">Integrity Status</th>
              <th className="py-3 px-4 text-right">State Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  {loading ? 'Querying audit registry...' : 'No audit events found.'}
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className={`hover:bg-slate-50/80 transition-colors ${
                  ev.is_flagged_risk ? 'bg-rose-50/20' : ''
                }`}>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(ev.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {ev.actor_name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                      {ev.actor_role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[11px] text-teal-800 whitespace-nowrap">
                    {ev.action_type}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="font-mono text-slate-500 text-[10px] uppercase mr-1">{ev.target_entity}:</span>
                    <strong className="text-slate-900">{ev.target_id}</strong>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {ev.is_flagged_risk ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        RISK ALERT: {ev.risk_reason || 'Anomaly Detected'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Normal Event
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Diff</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Diff Inspector Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Event #{selectedEvent.id} • {selectedEvent.action_type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Audit Event Diff Inspector
                </h3>
                <p className="text-xs text-slate-500">
                  Target: {selectedEvent.target_entity} ({selectedEvent.target_id})
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedEvent.is_flagged_risk && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Heuristic Risk Anomaly Triggered:</span>
                  <p>{selectedEvent.risk_reason}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Acting Officer & Role</span>
                <span className="font-semibold text-slate-900">{selectedEvent.actor_name} ({selectedEvent.actor_role})</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Recorded Timestamp (UTC)</span>
                <span className="font-mono text-slate-900">{selectedEvent.timestamp}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs font-mono">
              <span className="font-bold text-teal-300 block font-sans">
                Full Metadata / Pre-Post Change Difference Payload (JSON):
              </span>
              <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-200 overflow-x-auto max-h-60">
                {JSON.stringify(selectedEvent.details, null, 2)}
              </pre>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
