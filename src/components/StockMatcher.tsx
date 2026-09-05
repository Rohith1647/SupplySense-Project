import React from 'react';
import { MatchedCompanyStock } from '../services/aiRiskEngine';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  ShieldAlert, 
  Layers
} from 'lucide-react';

interface StockMatcherProps {
  matchedStock: MatchedCompanyStock[];
  allEnterpriseMatchedStock: MatchedCompanyStock[];
  locationName: string;
}

export const StockMatcher: React.FC<StockMatcherProps> = ({
  matchedStock,
  allEnterpriseMatchedStock,
  locationName
}) => {
  const { currentCompany } = useAuth();
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldAlert size={22} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            {t('stockMatchHeader')}
          </h3>
        </div>
        <span className="badge badge-info" style={{ fontSize: '0.75rem', textTransform: 'none' }}>
          Company Context: <strong>{currentCompany.name}</strong>
        </span>
      </div>

      {matchedStock.length === 0 ? (
        <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={24} style={{ color: 'var(--status-safe)' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--status-safe)', margin: 0 }}>
                No Direct Exposure in Active Company Inventory
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                {t('noMatchedStock')} Logged-in company <strong>{currentCompany.name}</strong> has no registered stock stored in <strong>{locationName}</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {t('matchedStockNotice')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matchedStock.map((match, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  borderLeft: `4px solid ${
                    match.riskSeverity === 'critical'
                      ? 'var(--status-critical)'
                      : match.riskSeverity === 'high'
                      ? 'var(--status-warning)'
                      : 'var(--accent-blue)'
                  }`,
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {match.item.name}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {match.item.sku}
                      </span>
                      <span className={`badge badge-${match.riskSeverity === 'critical' ? 'critical' : match.riskSeverity === 'high' ? 'warning' : 'safe'}`}>
                        {match.riskSeverity.toUpperCase()} RISK
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                        Quantity in Stock: {match.item.quantity.toLocaleString()} {match.item.unit}
                      </span>
                      <span style={{ color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> Location: {match.item.locationTag}
                      </span>
                      <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Layers size={14} /> BOM Parent: {match.item.bomParent}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: '#f87171', display: 'block', marginBottom: '0.2rem' }}>Impact Diagnostic:</strong>
                    {match.impactExplanation}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.2rem' }}>Recommended Mitigation:</strong>
                    {match.mitigationAdvice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enterprise-wide Cross-Company Radar */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={16} style={{ color: 'var(--accent-purple)' }} />
          Enterprise Cross-Company Stock Exposure in {locationName} ({allEnterpriseMatchedStock.length} items across all registered companies)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {allEnterpriseMatchedStock.map((entry, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{entry.item.companyName}</div>
              <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{entry.item.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                Stock: {entry.item.quantity.toLocaleString()} {entry.item.unit} @ {entry.item.locationTag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
