import { useState } from 'react';
import { careerPaths } from '../data/careerPathsData';

export default function CareerPaths() {
  const [activeStream, setActiveStream] = useState('science');

  const streams = [
    { id: 'science', label: '🔬 Science', color: '#0ea5e9' },
    { id: 'commerce', label: '📊 Commerce', color: '#f97316' },
    { id: 'arts', label: '🎭 Arts', color: '#8b5cf6' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f1923', marginBottom: 8, textAlign: 'center' }}>
          🗺️ Career Pathways
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: 32, textAlign: 'center' }}>
          Explore what each degree leads to — jobs, exams, and opportunities
        </p>

        {/* Stream Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 40,
          background: 'white',
          padding: 6,
          borderRadius: 12,
          border: '1px solid #e2d9c8'
        }}>
          {streams.map(stream => (
            <button
              key={stream.id}
              onClick={() => setActiveStream(stream.id)}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: activeStream === stream.id ? stream.color : 'transparent',
                color: activeStream === stream.id ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {stream.label}
            </button>
          ))}
        </div>

        {/* Career Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20
        }}>
          {careerPaths[activeStream].map(path => (
            <div
              key={path.id}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #e2d9c8',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: streams.find(s => s.id === activeStream).color + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {path.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>
                    {path.degree}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    ⏱ {path.duration}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Career Outcomes:
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {path.careers.map((career, idx) => (
                    <li key={idx} style={{
                      fontSize: '0.85rem',
                      color: '#0f1923',
                      marginBottom: 6,
                      paddingLeft: 16,
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: streams.find(s => s.id === activeStream).color,
                        fontWeight: 700
                      }}>→</span>
                      {career}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}