import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Network, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

interface BomNode {
  id: string;
  name: string;
  category: string;
  company: string;
  location: string;
  quantity: string;
  riskStatus: 'critical' | 'warning' | 'safe';
  children?: BomNode[];
}

const SAMPLE_BOM_TREE: BomNode = {
  id: 'root-1',
  name: 'Smart Autonomous Industrial Drone X1',
  category: 'Finished Product',
  company: 'Apex Microelectronics',
  location: 'Stuttgart / Global Assembly',
  quantity: '450 Units Ready',
  riskStatus: 'warning',
  children: [
    {
      id: 'sub-1',
      name: 'EV Battery Management System (BMS)',
      category: 'Power Subassembly',
      company: 'Apex Microelectronics',
      location: 'Shenzhen Free Trade Zone',
      quantity: '12,000 Units',
      riskStatus: 'critical',
      children: [
        {
          id: 'leaf-1',
          name: '32-Bit Microcontrollers (MCU-550)',
          category: 'Semiconductor Component',
          company: 'Apex Microelectronics',
          location: 'Shenzhen Hub',
          quantity: '45,000 Units',
          riskStatus: 'critical'
        },
        {
          id: 'leaf-2',
          name: '300mm Silicon Wafer Substrates',
          category: 'Raw Wafer Substrate',
          company: 'Acme Supply Systems',
          location: 'Taiwan Strait Corridor',
          quantity: '18,000 Units',
          riskStatus: 'critical'
        }
      ]
    },
    {
      id: 'sub-2',
      name: 'Optoelectronic Guidance & Lidar Unit',
      category: 'Sensor Package',
      company: 'Apex Microelectronics',
      location: 'Tokyo Plant',
      quantity: '28,000 Units',
      riskStatus: 'safe',
      children: [
        {
          id: 'leaf-3',
          name: 'Precision Optical Glass Lenses',
          category: 'Optical Subcomponent',
          company: 'Titan Heavy Machinery',
          location: 'Los Angeles Hub',
          quantity: '1,400 Units',
          riskStatus: 'safe'
        }
      ]
    }
  ]
};

export const BomGraph: React.FC = () => {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<BomNode>(SAMPLE_BOM_TREE);

  const renderNodeCard = (node: BomNode) => {
    const isSelected = selectedNode.id === node.id;
    return (
      <div
        key={node.id}
        onClick={() => setSelectedNode(node)}
        style={{
          background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(16, 22, 34, 0.85)',
          border: isSelected ? '2px solid var(--accent-cyan)' : `1px solid ${node.riskStatus === 'critical' ? 'rgba(239,68,68,0.4)' : node.riskStatus === 'warning' ? 'rgba(245,158,11,0.4)' : 'var(--border-subtle)'}`,
          borderRadius: '14px',
          padding: '1.1rem 1.25rem',
          minWidth: '260px',
          cursor: 'pointer',
          boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.25)' : 'none',
          transition: 'all 0.25s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span className={`badge badge-${node.riskStatus}`}>
            {node.riskStatus.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{node.category}</span>
        </div>

        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
          {node.name}
        </h4>

        <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '0.3rem' }}>
          {node.company}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={12} /> {node.location}
          </span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{node.quantity}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel glass-panel-glow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Network size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {t('bomGraph')} — Knowledge Linkage Tree
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Relational Bill of Materials graph tracing raw wafer & semiconductor shortages to finished product assemblies.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Tree Display */}
      <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', minWidth: '850px' }}>
          {/* Level 1: Root Product */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              LEVEL 1: FINISHED ENTERPRISE PRODUCT
            </div>
            {renderNodeCard(SAMPLE_BOM_TREE)}
          </div>

          <div style={{ width: '2px', height: '30px', background: 'var(--border-glow)' }} />

          {/* Level 2: Subassemblies */}
          <div style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              LEVEL 2: MAJOR SUBASSEMBLIES & MODULES
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem' }}>
              {SAMPLE_BOM_TREE.children?.map(sub => (
                <div key={sub.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                  {renderNodeCard(sub)}
                  {sub.children && <div style={{ width: '2px', height: '25px', background: 'var(--border-glow)' }} />}
                  {sub.children && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {sub.children.map(leaf => renderNodeCard(leaf))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Details Card */}
      <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Node Inspector: {selectedNode.name}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Category: <strong>{selectedNode.category}</strong> • Owned by: <strong>{selectedNode.company}</strong> • Stored at: <strong>{selectedNode.location}</strong>
        </p>
        <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
          {selectedNode.riskStatus === 'critical' ? (
            <span style={{ color: '#ef4444', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={14} /> CRITICAL CORRIDOR RISK: This component is subject to regional port/weather disruptions. Downstream finished assembly "{SAMPLE_BOM_TREE.name}" is flagged for production delay.
            </span>
          ) : (
            <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} /> NORMAL BUFFER: Stock buffer in {selectedNode.location} remains stable under current environmental conditions.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
