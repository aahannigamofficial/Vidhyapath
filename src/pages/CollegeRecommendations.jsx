import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getRecommendedColleges } from '../Services/collegeMatchingService';

export default function CollegeRecommendations({ user }) {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    // Get student profile and quiz results
    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setStudentProfile(data);
      const recommended = getRecommendedColleges(data, data.aptitude_score);
      setRecommendations(recommended);
    }
    
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: '#faf8f3'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid #e2d9c8',
            borderTop: '4px solid #f97316',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280' }}>Finding your perfect colleges...</p>
        </div>
      </div>
    );
  }

  const topStream = studentProfile?.aptitude_score?.topStream || studentProfile?.stream || 'your chosen stream';
  const streamPercentage = studentProfile?.aptitude_score?.percentages?.[topStream] || 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f1923', marginBottom: 8 }}>
          🎯 Your Recommended Colleges
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: 32 }}>
          Based on your profile and aptitude results
        </p>

        {/* Profile Summary */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 24,
          border: '1px solid #e2d9c8',
          marginBottom: 32
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f1923', marginBottom: 12 }}>
            📋 Your Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#6b7280' }}>Name:</span>{' '}
              <span style={{ fontWeight: 600, color: '#0f1923' }}>{studentProfile?.full_name}</span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Location:</span>{' '}
              <span style={{ fontWeight: 600, color: '#0f1923' }}>{studentProfile?.district}, {studentProfile?.state}</span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Stream:</span>{' '}
              <span style={{ fontWeight: 600, color: '#f97316', textTransform: 'capitalize' }}>
                {topStream} ({streamPercentage}% match)
              </span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Class:</span>{' '}
              <span style={{ fontWeight: 600, color: '#0f1923' }}>{studentProfile?.current_class}</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 40,
            border: '1px solid #e2d9c8',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
              No colleges found matching your profile yet. Try updating your location or stream preference.
            </p>
          </div>
        ) : (
          recommendations.map((college, index) => (
            <div
              key={college.id}
              style={{
                background: 'white',
                borderRadius: 16,
                border: index === 0 ? '2px solid #f97316' : '1px solid #e2d9c8',
                marginBottom: 24,
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              {/* Rank Badge */}
              {index === 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, #f97316, #fb923c)',
                  padding: '8px 16px',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textAlign: 'center'
                }}>
                  ⭐ Top Recommendation — {college.matchScore}% Match
                </div>
              )}

              <div style={{ padding: 28 }}>
                {/* College Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    flexShrink: 0
                  }}>
                    🏛️
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f1923' }}>
                        {college.name}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        background: '#f0fdf4',
                        color: '#166534',
                        border: '1px solid #bbf7d0',
                        borderRadius: 100,
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        #{index + 1}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: 8 }}>
                      📍 {college.district === studentProfile?.district ? (
                        <strong style={{ color: '#f97316' }}>Your district</strong>
                      ) : (
                        `${college.district}, ${college.state}`
                      )} · {college.totalSeats} seats · {college.cutoffPercentage}% cutoff
                    </p>
                    
                    {/* Programs */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {college.programs.map(program => (
                        <span key={program} style={{
                          padding: '3px 10px',
                          background: '#bbf7d0',
                          color: '#166534',
                          border: '1.5px solid #86efac',
                          borderRadius: 100,
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}>
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 16
                }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', marginBottom: 8 }}>
                    💬 Why this college is perfect for you:
                  </p>
                  <p style={{ fontSize: '0.95rem', color: '#166534', lineHeight: 1.6 }}>
                    {college.recommendationReason}
                  </p>
                </div>

                {/* Facilities */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {college.hasHostel && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#bae6fd',
                      color: '#0369a1',
                      border: '1.5px solid #7dd3fc',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      🏠 Hostel
                    </span>
                  )}
                  {college.hasGirlsHostel && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#ddd6fe',
                      color: '#7c3aed',
                      border: '1.5px solid #c4b5fd',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      👭 Girls Hostel
                    </span>
                  )}
                  {college.scholarshipAvailable && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#fed7aa',
                      color: '#b45309',
                      border: '1.5px solid #fdba74',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      💰 Scholarship
                    </span>
                  )}
                  {college.hasLab && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#e5e7eb',
                      color: '#374151',
                      border: '1.5px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      🔬 Lab
                    </span>
                  )}
                  {college.hasInternet && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#e5e7eb',
                      color: '#374151',
                      border: '1.5px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      📡 Internet
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        <div style={{
          background: '#fff7ed',
          border: '1px solid #fdba74',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#9a3412', lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> These recommendations are based on your profile and quiz results. 
            Visit each college's website or contact them directly for the latest admission information and eligibility criteria.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}