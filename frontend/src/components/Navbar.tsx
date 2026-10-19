import React from 'react';
import { Shield, Sparkles, Building2, ExternalLink, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: 'marketing' | 'demo';
  onNavigateView: (view: 'marketing' | 'demo') => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  activeSection,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'problems', label: 'Problems We Address' },
    { id: 'modules', label: 'Platform Modules' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'transparency', label: 'Transparency & Integrity' },
    { id: 'security', label: 'Security & Privacy' },
    { id: 'pilot', label: 'Pilot Programme' },
    { id: 'about', label: 'About' },
  ];

  const handleLinkClick = (id: string) => {
    if (currentView !== 'marketing') {
      onNavigateView('marketing');
    }
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Government-style Notice Bar */}
      <div className="bg-[#0f2942] text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">FAIRGOV AI — GOVTECH PILOT INITIATIVE</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">Auditable Employee Records & Promotion Management Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-amber-300 border border-amber-500/30">
              Evaluation & Controlled Pilot Demonstration
            </span>
            <span className="hidden md:inline">DoPT & Central Civil Services Guidelines Aligned</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => { onNavigateView('marketing'); onNavigateSection('home'); }}
          >
            <div className="w-10 h-10 rounded-lg bg-[#0f2942] flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0f2942]">FairGov</span>
                <span className="text-xl font-bold tracking-tight text-teal-600">AI</span>
                <span className="text-[10px] uppercase font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300">
                  Gov-Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5">
                Less Paperwork. Clearer Decisions. Accountable Governance.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links (When on marketing site) */}
          {currentView === 'marketing' && (
            <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-700">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`hover:text-teal-700 transition-colors py-1 ${
                    activeSection === link.id
                      ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                      : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {currentView === 'marketing' ? (
              <>
                <button
                  onClick={() => handleLinkClick('contact')}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
                >
                  Request a Demo
                </button>
                <button
                  onClick={() => onNavigateView('demo')}
                  className="inline-flex items-center gap-2 bg-[#0f2942] hover:bg-[#153a5c] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  Launch Live Demo App
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigateView('marketing')}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide border border-slate-300 transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                Return to Product Overview
              </button>
            )}

            {/* Mobile menu trigger */}
            {currentView === 'marketing' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && currentView === 'marketing' && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleLinkClick('contact')}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-semibold text-teal-700 hover:bg-teal-50"
          >
            Request a Demonstration
          </button>
        </div>
      )}
    </header>
  );
};
