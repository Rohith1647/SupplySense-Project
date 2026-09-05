import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useInventory } from '../context/InventoryContext';
import { searchLocationGeo } from '../services/geocodingService';
import { fetchLiveWeather } from '../services/weatherService';
import { fetchLocationNews } from '../services/newsService';
import { generateAiRiskAnalysis, RiskAnalysisResult } from '../services/aiRiskEngine';
import { StockMatcher } from './StockMatcher';
import { GoogleWeatherWidget } from './GoogleWeatherWidget';
import { 
  Search, 
  MapPin, 
  Newspaper, 
  BrainCircuit, 
  TrendingUp, 
  Clock, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const LocationAnalyzer: React.FC = () => {
  const { t } = useLanguage();
  const { inventory, companyInventory } = useInventory();

  const [query, setQuery] = useState('Shenzhen');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null);
  const [timeFilter, setTimeFilter] = useState<'60d' | '30d' | '7d' | '24h'>('60d');

  const runAnalysis = async (targetLocation: string) => {
    let cleaned = targetLocation.trim();
    const halfLen = Math.floor(cleaned.length / 2);
    if (cleaned.length > 3 && cleaned.substring(0, halfLen).toLowerCase() === cleaned.substring(halfLen).toLowerCase()) {
      cleaned = cleaned.substring(0, halfLen);
    }
    if (!cleaned) return;
    setQuery(cleaned);
    setLoading(true);
    try {
      // 1. Geocode location
      const geo = await searchLocationGeo(cleaned);

      // 2. Fetch live weather aligned with Google Weather
      const weather = await fetchLiveWeather(geo.latitude, geo.longitude, geo.name);

      // 3. Fetch real-time logistics news
      const news = await fetchLocationNews(geo.name);

      // 4. Generate AI Risk Analysis & Product Demand Prediction
      const result = generateAiRiskAnalysis(
        geo,
        weather,
        news,
        companyInventory,
        inventory
      );

      setAnalysisResult(result);
    } catch (err) {
      console.error("Error executing location risk analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis('Shenzhen');
  }, [companyInventory, inventory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis(query);
  };

  const presetLocations = ['Chennai', 'Hyderabad', 'Bangalore', 'Shenzhen', 'Rotterdam', 'Tokyo', 'Los Angeles'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Location Search Bar & Preset Chips */}
      <div className="glass-panel glass-panel-glow" style={{ padding: '1.75rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <MapPin size={22} style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
            <input
              type="text"
              className="form-input"
              style={{
                paddingLeft: '3.2rem',
                height: '52px',
                fontSize: '1.05rem',
                borderRadius: '12px',
                background: 'rgba(8, 12, 22, 0.95)'
              }}
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ height: '52px', padding: '0 2rem', fontSize: '1rem', borderRadius: '12px' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                {t('searching')}
              </>
            ) : (
              <>
                <Search size={18} />
                {t('searchBtn')}
              </>
            )}
          </button>
        </form>

        {/* Preset Quick Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Hotspots:</span>
          {presetLocations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setQuery(loc);
                runAnalysis(loc);
              }}
              style={{
                background: query.toLowerCase() === loc.toLowerCase() ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: query.toLowerCase() === loc.toLowerCase() ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                color: query.toLowerCase() === loc.toLowerCase() ? 'var(--accent-cyan)' : 'var(--text-main)',
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📍 {loc}
            </button>
          ))}
        </div>
      </div>

      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Top Banner: Location Header & Composite Risk Scorecard */}
          <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-info">{analysisResult.location.country}</span>
                {analysisResult.location.admin1 && (
                  <span className="badge badge-secondary" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {analysisResult.location.admin1}
                  </span>
                )}
                <span className="badge badge-safe" style={{ textTransform: 'none' }}>
                  <Sparkles size={12} /> Live API Ingest
                </span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.2rem' }}>
                {analysisResult.location.name} Transport Hub
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Coordinates: {analysisResult.location.latitude.toFixed(4)}°N, {analysisResult.location.longitude.toFixed(4)}°E • Latency: 12ms (Quantized Qwen2.5-Local)
              </p>
            </div>

            {/* Composite Score Circle */}
            <div style={{
              background: 'rgba(10, 15, 26, 0.8)',
              border: `2px solid ${analysisResult.riskLevel === 'critical' ? 'var(--status-critical)' : analysisResult.riskLevel === 'warning' ? 'var(--status-warning)' : 'var(--status-safe)'}`,
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: analysisResult.riskLevel === 'critical' ? '0 0 25px rgba(239, 68, 68, 0.25)' : 'none'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t('severityScore')}
              </span>
              <div style={{
                fontSize: '2.75rem',
                fontWeight: 900,
                lineHeight: 1,
                margin: '0.3rem 0',
                color: analysisResult.riskLevel === 'critical' ? '#ef4444' : analysisResult.riskLevel === 'warning' ? '#f59e0b' : '#10b981'
              }}>
                {analysisResult.compositeRiskScore}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <span className={`badge badge-${analysisResult.riskLevel}`}>
                {analysisResult.riskLevel === 'critical' ? t('critical') : analysisResult.riskLevel === 'warning' ? t('warning') : t('safe')}
              </span>
            </div>
          </div>

          {/* Grid 2: Weather & News Real-Time Signals */}
          <div className="grid-2">
            {/* Live Pixel-Perfect Google Weather Widget */}
            <GoogleWeatherWidget weather={analysisResult.weather} />

            {/* Live Logistics Crisis News Feed */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Newspaper size={20} style={{ color: 'var(--accent-purple)' }} />
                  {t('newsHeader')}
                </h3>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                  📅 Past 60 Days Window (2 Months)
                </span>
              </div>

              {/* 60-Day / 2-Month Time Filter Bar */}
              <div style={{ display: 'flex', gap: '0.4rem', margin: '0.75rem 0 1rem 0', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setTimeFilter('60d')}
                  style={{
                    background: timeFilter === '60d' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    border: timeFilter === '60d' ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📅 Past 60 Days ({analysisResult.news.filter(n => (n.publishedDaysAgo ?? 0) <= 60).length})
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('30d')}
                  style={{
                    background: timeFilter === '30d' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    border: timeFilter === '30d' ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🗓️ Past 30 Days ({analysisResult.news.filter(n => (n.publishedDaysAgo ?? 0) <= 30).length})
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('7d')}
                  style={{
                    background: timeFilter === '7d' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    border: timeFilter === '7d' ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⏱️ Past 7 Days ({analysisResult.news.filter(n => (n.publishedDaysAgo ?? 0) <= 7).length})
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('24h')}
                  style={{
                    background: timeFilter === '24h' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    border: timeFilter === '24h' ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Past 24 Hours ({analysisResult.news.filter(n => (n.publishedDaysAgo ?? 0) <= 1).length})
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '0.3rem' }}>
                {analysisResult.news
                  .filter(item => {
                    if (timeFilter === '24h') return (item.publishedDaysAgo ?? 0) <= 1;
                    if (timeFilter === '7d') return (item.publishedDaysAgo ?? 0) <= 7;
                    if (timeFilter === '30d') return (item.publishedDaysAgo ?? 0) <= 30;
                    return (item.publishedDaysAgo ?? 0) <= 60;
                  })
                  .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid var(--border-glow)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>{item.category}</span>
                        <span className="badge badge-critical" style={{ fontSize: '0.68rem' }}>IMPACT: {item.impactScore}/10</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{item.publishedAt}</span>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: 'var(--text-main)',
                        lineHeight: 1.3,
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                    >
                      {item.title} ↗
                    </a>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {item.summary}
                    </p>

                    {item.productSurge && (
                      <div style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.78rem',
                        color: '#fbbf24',
                        fontWeight: 700
                      }}>
                        {item.productSurge}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Source: <strong style={{ color: 'var(--accent-cyan)' }}>{item.source}</strong></span>
                      
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem' }}
                        >
                          Open Direct Article <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Executive Summary Card */}
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <BrainCircuit size={24} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                {t('aiSummaryHeader')}
              </h3>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#e5e7eb', margin: 0 }}>
              {analysisResult.executiveSummary}
            </p>
          </div>

          {/* High-Demand / High-Risk Products Forecast */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <TrendingUp size={24} style={{ color: 'var(--status-warning)' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  {t('demandForecastHeader')}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Local LLM analysis cross-referencing regional production hubs, weather severity, and trade bottlenecks.
                </p>
              </div>
            </div>

            <div className="grid-3">
              {analysisResult.predictedHighDemandItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid var(--border-glow)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-critical">{item.demandTrend}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={12} /> {item.urgency}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.35rem' }}>
                      {item.itemName}
                    </h4>

                    <span className="badge badge-info" style={{ fontSize: '0.7rem', marginBottom: '0.75rem' }}>
                      {item.category}
                    </span>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '0.5rem' }}>
                      {item.reasoning}
                    </p>
                  </div>

                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block', width: '100%' }}>Impacted Sectors:</span>
                    {item.impactedIndustries.map((ind, j) => (
                      <span key={j} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px', color: '#d1d5db' }}>
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Stock Cross-Matcher Component */}
          <div className="glass-panel">
            <StockMatcher
              matchedStock={analysisResult.matchedCompanyStock}
              allEnterpriseMatchedStock={analysisResult.allEnterpriseMatchedStock}
              locationName={analysisResult.location.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};
