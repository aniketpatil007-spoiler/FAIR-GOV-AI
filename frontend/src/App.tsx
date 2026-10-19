import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './pages/marketing/Hero';
import { ProblemsWeAddress } from './pages/marketing/ProblemsWeAddress';
import { PlatformModules } from './pages/marketing/PlatformModules';
import { HowItWorks } from './pages/marketing/HowItWorks';
import { TransparencyIntegrity } from './pages/marketing/TransparencyIntegrity';
import { SecurityPrivacy } from './pages/marketing/SecurityPrivacy';
import { PilotProgramme } from './pages/marketing/PilotProgramme';
import { AboutFairGov } from './pages/marketing/AboutFairGov';
import { ContactDemo } from './pages/marketing/ContactDemo';
import { DemoApp } from './pages/demo/DemoApp';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'marketing' | 'demo'>('marketing');
  const [activeSection, setActiveSection] = useState<string>('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (currentView !== 'marketing') {
      setCurrentView('marketing');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        currentView={currentView}
        onNavigateView={setCurrentView}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {currentView === 'marketing' ? (
        <main className="flex-1">
          <Hero
            onLaunchDemo={() => setCurrentView('demo')}
            onRequestDemo={() => scrollToSection('contact')}
            onExploreModules={() => scrollToSection('modules')}
          />
          <ProblemsWeAddress />
          <PlatformModules />
          <HowItWorks />
          <TransparencyIntegrity />
          <SecurityPrivacy />
          <PilotProgramme
            onRequestDemo={() => scrollToSection('contact')}
          />
          <AboutFairGov />
          <ContactDemo />
        </main>
      ) : (
        <DemoApp onBackToOverview={() => setCurrentView('marketing')} />
      )}

      <Footer />
    </div>
  );
};

export default App;
