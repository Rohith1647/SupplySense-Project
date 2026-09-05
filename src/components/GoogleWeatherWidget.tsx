import React, { useState } from 'react';
import { WeatherData } from '../services/weatherService';
import { ExternalLink } from 'lucide-react';

interface GoogleWeatherWidgetProps {
  weather: WeatherData;
}

export const GoogleWeatherWidget: React.FC<GoogleWeatherWidgetProps> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<'temperature' | 'precipitation' | 'wind'>('temperature');
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const convertTemp = (tempC: number) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  // Process forecast points for the SVG curve
  const hourly = weather.hourlyForecast || [];
  const displayHours = hourly.slice(0, 8);

  const getPointValue = (item: typeof displayHours[0]) => {
    if (activeTab === 'precipitation') return item.pop;
    if (activeTab === 'wind') return item.windSpeed;
    return convertTemp(item.temp);
  };

  const values = displayHours.map(getPointValue);
  const minVal = values.length > 0 ? Math.min(...values) : 20;
  const maxVal = values.length > 0 ? Math.max(...values) : 40;
  const range = Math.max(1, maxVal - minVal);

  // Calculate SVG curve coordinates (width 600, height 70)
  const svgWidth = 600;
  const svgHeight = 70;
  const paddingX = 40;
  const paddingY = 20;

  const points = values.map((val, idx) => {
    const x = paddingX + (idx * (svgWidth - 2 * paddingX)) / Math.max(1, values.length - 1);
    const normalizedY = (val - minVal) / range;
    const y = svgHeight - paddingY - normalizedY * (svgHeight - 2 * paddingY);
    return { x, y, val };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '')
    : '';

  const curveColor = activeTab === 'temperature' ? '#f59e0b' : activeTab === 'precipitation' ? '#3b82f6' : '#00f2fe';

  return (
    <div style={{
      background: 'rgba(12, 17, 29, 0.95)',
      border: '1px solid var(--border-glow)',
      borderRadius: '16px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      {/* Top Header: Location Title & Google Weather Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>📍</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {weather.locationTitle}
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>• Choose area</span>
        </div>

        <a
          href={weather.googleWeatherUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', gap: '0.4rem', color: 'var(--accent-cyan)' }}
        >
          Open Live Google Weather <ExternalLink size={12} />
        </a>
      </div>

      {/* Main Weather Snapshot Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        {/* Left: Cloud Icon, Big Temp & Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ fontSize: '3rem', lineHeight: 1 }}>🌧️</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: '#fff' }}>
                {convertTemp(weather.temperature)}
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                <button
                  type="button"
                  onClick={() => setUnit('C')}
                  style={{ background: 'none', border: 'none', color: unit === 'C' ? '#fff' : 'var(--text-subtle)', cursor: 'pointer', fontWeight: unit === 'C' ? 800 : 400 }}
                >
                  °C
                </button>
                {' | '}
                <button
                  type="button"
                  onClick={() => setUnit('F')}
                  style={{ background: 'none', border: 'none', color: unit === 'F' ? '#fff' : 'var(--text-subtle)', cursor: 'pointer', fontWeight: unit === 'F' ? 800 : 400 }}
                >
                  °F
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>Precipitation: <strong style={{ color: 'var(--accent-cyan)' }}>{weather.precipitationProbability}%</strong></div>
              <div>Humidity: <strong style={{ color: '#60a5fa' }}>{weather.humidity}%</strong></div>
              <div>Wind: <strong style={{ color: '#f59e0b' }}>{weather.windSpeed} km/h</strong></div>
            </div>
          </div>
        </div>

        {/* Right: Weather Title & Time */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Weather</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Thursday, 7:00 pm</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{weather.conditionText}</div>
        </div>
      </div>

      {/* Google Weather Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.25rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('temperature')}
          style={{
            background: 'none',
            border: 'none',
            paddingBottom: '0.5rem',
            borderBottom: activeTab === 'temperature' ? '3px solid #f59e0b' : 'none',
            color: activeTab === 'temperature' ? '#f59e0b' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Temperature
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('precipitation')}
          style={{
            background: 'none',
            border: 'none',
            paddingBottom: '0.5rem',
            borderBottom: activeTab === 'precipitation' ? '3px solid #3b82f6' : 'none',
            color: activeTab === 'precipitation' ? '#3b82f6' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Precipitation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('wind')}
          style={{
            background: 'none',
            border: 'none',
            paddingBottom: '0.5rem',
            borderBottom: activeTab === 'wind' ? '3px solid #00f2fe' : 'none',
            color: activeTab === 'wind' ? '#00f2fe' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Wind
        </button>
      </div>

      {/* Interactive Yellow Forecast Curve SVG Graph */}
      <div style={{ position: 'relative', width: '100%', height: '110px', marginTop: '0.5rem' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '70px', overflow: 'visible' }}>
          <path d={pathD} fill="none" stroke={curveColor} strokeWidth="3" strokeLinecap="round" />
          {points.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="4" fill={curveColor} />
              <text x={pt.x} y={pt.y - 8} fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                {pt.val}{activeTab === 'precipitation' ? '%' : activeTab === 'wind' ? ' km/h' : '°'}
              </text>
            </g>
          ))}
        </svg>

        {/* Hour Labels strip right below graph */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {displayHours.map((h, i) => (
            <div key={i} style={{ textAlign: 'center', width: '45px' }}>
              {h.time}
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Cards Strip (Google Weather Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: '0.4rem', marginTop: '0.5rem' }}>
        {weather.dailyForecast.map((d, i) => (
          <div
            key={i}
            style={{
              background: i === 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: i === 0 ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '0.65rem 0.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>{d.day}</div>
            <div style={{ fontSize: '1.25rem', margin: '0.1rem 0' }}>{d.icon || '⛅'}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {convertTemp(d.tempMax)}° <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>{convertTemp(d.tempMin)}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Red Excessive Heat / Weather Warning Section (Google Weather Style) */}
      {weather.weatherAlerts && weather.weatherAlerts.length > 0 && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ef4444', margin: 0 }}>
            {weather.weatherAlerts[0]}
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
            {weather.locationTitle}, India
          </p>
        </div>
      )}
    </div>
  );
};
