import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { Navbar } from './components/Navbar';
import { CompanyAuthModal } from './components/CompanyAuthModal';
import { LocationAnalyzer } from './components/LocationAnalyzer';
import { InventoryManager } from './components/InventoryManager';
import { BomGraph } from './components/BomGraph';
import { GlobalRiskMap } from './components/GlobalRiskMap';
import { Sparkles } from 'lucide-react';
import './styles/theme.css';
import './styles/app.css';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'inventory' | 'bom' | 'corridors'>('analysis');

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <CompanyAuthModal />

      <main className="main-content">
        {activeTab === 'analysis' && <LocationAnalyzer />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'bom' && <BomGraph />}
        {activeTab === 'corridors' && <GlobalRiskMap />}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        background: 'rgba(8, 12, 22, 0.95)',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>SupplySense Platform — Location-Aware AI Risk & Inventory Linkage</span>
          </div>
          <div>
            Powered by Quantized Open-Source Local LLMs & Open-Meteo Environmental Ingestion
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <InventoryProvider>
        <LanguageProvider>
          <MainApp />
        </LanguageProvider>
      </InventoryProvider>
    </AuthProvider>
  );
};

export default App;
