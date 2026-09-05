import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe2 } from 'lucide-react';

interface CorridorData {
  id: string;
  name: string;
  region: string;
  type: string;
  riskScore: number; // 0-100
  status: 'Critical' | 'Warning' | 'Normal';
  primaryThreat: string;
  volume: string;
}

const GLOBAL_CORRIDORS: CorridorData[] = [
  {
    id: 'c1',
    name: 'Shenzhen - Yantian Port Corridor',
    region: 'East Asia / Pearl River Delta',
    type: 'Maritime Export Hub',
    riskScore: 88,
    status: 'Critical',
    primaryThreat: 'Super Typhoon Warning & Power Throttling',
    volume: '24.1M TEU / year'
  },
  {
    id: 'c2',
    name: 'Taiwan Strait Shipping Lane',
    region: 'East Asia Marine Corridor',
    type: 'Semiconductor Transit Bottleneck',
    riskScore: 92,
    status: 'Critical',
    primaryThreat: 'Naval Exclusion Exercises & Bashi Channel Rerouting',
    volume: '48% of global container fleet'
  },
  {
    id: 'c3',
    name: 'Rotterdam - Maasvlakte II Hub',
    region: 'North-West Europe',
    type: 'Deepsea Terminal',
    riskScore: 78,
    status: 'Critical',
    primaryThreat: '24-Hour Dockworker Labor Strike & Rhine Barge Closure',
    volume: '14.5M TEU / year'
  },
  {
    id: 'c4',
    name: 'Tokyo - Chiba Freight Corridor',
    region: 'Japan Coastal Zone',
    type: 'High-Tech Electronics',
    riskScore: 45,
    status: 'Warning',
    primaryThreat: 'Seismic Cleanroom Yield Audits',
    volume: 'Key Precision Optics'
  },
  {
    id: 'c5',
    name: 'Los Angeles / Long Beach Complex',
    region: 'North America Pacific',
    type: 'Intermodal Rail & Docks',
    riskScore: 62,
    status: 'Warning',
    primaryThreat: 'Intermodal Rail Yard Dwell Time Spikes (7.8 Days)',
    volume: '10.6M TEU / year'
  },
  {
    id: 'c6',
    name: 'Rhine River Waterway (Kaub Gauge)',
    region: 'Central Europe Inland',
    type: 'Heavy Industrial Barge Route',
    riskScore: 35,
    status: 'Normal',
    primaryThreat: 'Low Water Level Seasonal Monitoring',
    volume: '180M Tons Freight / year'
  }
];

export const GlobalRiskMap: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel glass-panel-glow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#080b11'
          }}>
            <Globe2 size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {t('globalRiskMap')} — Trade Bottleneck Monitor
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Continuous localized web ingestion tracking high-risk transport corridors worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Corridors */}
      <div className="grid-3">
        {GLOBAL_CORRIDORS.map((corridor) => (
          <div
            key={corridor.id}
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              borderLeft: `4px solid ${
                corridor.status === 'Critical' ? '#ef4444' : corridor.status === 'Warning' ? '#f59e0b' : '#10b981'
              }`
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-info">{corridor.type}</span>
                <span className={`badge badge-${corridor.status === 'Critical' ? 'critical' : corridor.status === 'Warning' ? 'warning' : 'safe'}`}>
                  SCORE: {corridor.riskScore}/100
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                {corridor.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {corridor.region} • Volume: {corridor.volume}
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                Primary Active Threat:
              </span>
              <span style={{ fontSize: '0.82rem', color: '#e5e7eb' }}>
                {corridor.primaryThreat}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
