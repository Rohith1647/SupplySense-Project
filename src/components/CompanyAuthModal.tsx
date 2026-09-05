import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, X, PlusCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CompanyAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, allCompanies, currentCompany, loginCompany, registerCompany } = useAuth();
  const { t } = useLanguage();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newHq, setNewHq] = useState('');
  const [newCode, setNewCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newCode.trim()) return;
    registerCompany({
      name: newCompanyName.trim(),
      industry: newIndustry.trim() || 'Global Supply Chain',
      headquarters: newHq.trim() || 'International',
      code: newCode.trim().toUpperCase()
    });
    setNewCompanyName('');
    setNewCode('');
    setIsRegisterMode(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building2 size={24} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {isRegisterMode ? 'Register Enterprise Account' : t('switchCompany')}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Multi-tenant isolated stock inventory & company scope
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {!isRegisterMode ? (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select a company workspace to inspect isolated inventory & cross-match location crisis alerts:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {allCompanies.map((company) => {
                const isSelected = company.id === currentCompany.id;
                return (
                  <div
                    key={company.id}
                    onClick={() => loginCompany(company.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.1rem',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: company.logoColor || '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#fff'
                      }}>
                        {company.code.substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{company.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {company.industry} • {company.headquarters}
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-cyan)' }} />
                    ) : (
                      <ShieldCheck size={18} style={{ color: 'var(--text-subtle)' }} />
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="btn btn-secondary"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                <PlusCircle size={16} />
                Register New Enterprise Company
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Zenith Semiconductor Corp"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ticker / Company Code *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. ZTH"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry Domain</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Electric Vehicle Powertrains"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Headquarters City / Country</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tokyo, Japan"
                value={newHq}
                onChange={(e) => setNewHq(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setIsRegisterMode(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Create & Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
