import React, { useState } from 'react';
import {
  LayoutDashboard, Users, FileCheck, Building, Award,
  Scale, MessageSquare, ShieldAlert, UserCheck, ChevronDown
} from 'lucide-react';
import { DEMO_PERSONAS } from '../../personas';
import { UserPersona } from '../../types';
import { DemoDashboard } from './DemoDashboard';
import { DemoEmployees } from './DemoEmployees';
import { DemoDocuments } from './DemoDocuments';
import { DemoVacancies } from './DemoVacancies';
import { DemoApplications } from './DemoApplications';
import { DemoRulesEngine } from './DemoRulesEngine';
import { DemoAppeals } from './DemoAppeals';
import { DemoAudit } from './DemoAudit';

interface DemoAppProps {
  onBackToOverview: () => void;
}

export const DemoApp: React.FC<DemoAppProps> = ({ onBackToOverview }) => {
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(DEMO_PERSONAS[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Records', icon: Users },
    { id: 'documents', label: 'Document Vault', icon: FileCheck },
    { id: 'vacancies', label: 'Cadre Vacancies', icon: Building },
    { id: 'applications', label: 'Applications & Receipts', icon: Award },
    { id: 'rules', label: 'Rules & Explainable Ranking', icon: Scale },
    { id: 'appeals', label: 'Statutory Appeals', icon: MessageSquare },
    { id: 'audit', label: 'Audit Trails & Anomaly Alerts', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Persona Switcher Header */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0f2942] text-teal-400 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                Role Persona Switcher (Test Separation of Duties)
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={currentPersona.role}
                  onChange={(e) => {
                    const found = DEMO_PERSONAS.find(p => p.role === e.target.value);
                    if (found) setCurrentPersona(found);
                  }}
                  className="text-xs font-bold text-slate-900 border border-slate-300 rounded px-2.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  {DEMO_PERSONAS.map(p => (
                    <option key={p.role} value={p.role}>
                      {p.role}: {p.name} ({p.designation})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 hidden md:inline">
                  • {currentPersona.department}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-semibold">
              Live Interactive Prototype
            </span>
            <button
              onClick={onBackToOverview}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1"
            >
              Back to Marketing Site
            </button>
          </div>

        </div>
      </div>

      {/* Demo Tab Navigation Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#0f2942] shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {activeTab === 'dashboard' && (
          <DemoDashboard currentPersona={currentPersona} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'employees' && (
          <DemoEmployees currentPersona={currentPersona} />
        )}
        {activeTab === 'documents' && (
          <DemoDocuments currentPersona={currentPersona} />
        )}
        {activeTab === 'vacancies' && (
          <DemoVacancies currentPersona={currentPersona} />
        )}
        {activeTab === 'applications' && (
          <DemoApplications currentPersona={currentPersona} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'rules' && (
          <DemoRulesEngine currentPersona={currentPersona} onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'appeals' && (
          <DemoAppeals currentPersona={currentPersona} />
        )}
        {activeTab === 'audit' && (
          <DemoAudit currentPersona={currentPersona} />
        )}
      </main>

    </div>
  );
};
