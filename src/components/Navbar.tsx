import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Boxes, 
  Search, 
  Network, 
  Globe2, 
  Languages, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'analysis' | 'inventory' | 'bom' | 'corridors';
  setActiveTab: (tab: 'analysis' | 'inventory' | 'bom' | 'corridors') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { t, language, setLanguage, languageOptions } = useLanguage();
  const { currentCompany, setIsAuthModalOpen } = useAuth();

  return (
    <header style={{
      background: 'rgba(10, 15, 26, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.8rem 2rem'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#080b11',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
          }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }} className="title-gradient">
              {t('appTitle')}
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`btn ${activeTab === 'analysis' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Search size={16} />
            {t('locationAnalysis')}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Boxes size={16} />
            {t('companyInventory')}
          </button>
          <button
            onClick={() => setActiveTab('bom')}
            className={`btn ${activeTab === 'bom' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Network size={16} />
            {t('bomGraph')}
          </button>
          <button
            onClick={() => setActiveTab('corridors')}
            className={`btn ${activeTab === 'corridors' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Globe2 size={16} />
            {t('globalRiskMap')}
          </button>
        </nav>

        {/* Right Section: Company Auth Badge & Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Active Company Pill */}
          <div
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              padding: '0.45rem 0.9rem',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to switch or login with company credentials"
          >
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: currentCompany.logoColor || '#00f2fe',
              boxShadow: `0 0 8px ${currentCompany.logoColor || '#00f2fe'}`
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('welcomeCompany')}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentCompany.name} ({currentCompany.code})
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Languages size={18} style={{ color: 'var(--accent-cyan)' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="form-select"
              style={{
                fontSize: '0.82rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {languageOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.flag} {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
