import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    completedQuiz: 0,
    streamBreakdown: { science: 0, commerce: 0, arts: 0, vocational: 0 },
    stateBreakdown: {},
    recentSignups: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    // Get all students
    const { data: students } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (students) {
      // Calculate stats
      const totalStudents = students.length;
      const completedQuiz = students.filter(s => s.aptitude_score).length;
      
      // Stream breakdown
      const streamBreakdown = { science: 0, commerce: 0, arts: 0, vocational: 0 };
      students.forEach(s => {
        const stream = s.aptitude_score?.topStream || s.stream;
        if (stream && streamBreakdown.hasOwnProperty(stream)) {
          streamBreakdown[stream]++;
        }
      });

      // State breakdown
      const stateBreakdown = {};
      students.forEach(s => {
        if (s.state) {
          stateBreakdown[s.state] = (stateBreakdown[s.state] || 0) + 1;
        }
      });

      // Recent signups (last 5)
      const recentSignups = students.slice(0, 5);

      setStats({
        totalStudents,
        completedQuiz,
        streamBreakdown,
        stateBreakdown,
        recentSignups
      });
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
        background: '#faf8f3'
      }}>
        <p style={{ color: '#6b7280' }}>Loading analytics...</p>
      </div>
    );
  }

  const quizCompletionRate = stats.totalStudents > 0 
    ? Math.round((stats.completedQuiz / stats.totalStudents) * 100) 
    : 0;

  const topStream = Object.entries(stats.streamBreakdown)
    .sort((a, b) => b[1] - a[1])[0];

  const topState = Object.entries(stats.stateBreakdown)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '2rem', color: '#0f1923', marginBottom: 8 }}>
            📊 Platform Analytics
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Real-time insights into VidyaPath usage and impact
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 40
        }}>
          <MetricCard
            icon="👥"
            value={stats.totalStudents}
            label="Total Students"
            color="#f97316"
            animate={true}
          />
          <MetricCard
            icon="✅"
            value={stats.completedQuiz}
            label="Completed Quiz"
            color="#166534"
          />
          <MetricCard
            icon="📈"
            value={`${quizCompletionRate}%`}
            label="Completion Rate"
            color="#0369a1"
          />
          <MetricCard
            icon="🎓"
            value={topStream ? topStream[0] : 'N/A'}
            label="Most Popular Stream"
            color="#7c3aed"
            capitalize={true}
          />
        </div>

        {/* Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: 24,
          marginBottom: 40
        }}>
          {/* Stream Distribution */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 28,
            border: '1px solid #e2d9c8'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f1923', marginBottom: 20 }}>
              🎯 Stream Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(stats.streamBreakdown).map(([stream, count]) => {
                const percentage = stats.totalStudents > 0 
                  ? Math.round((count / stats.totalStudents) * 100) 
                  : 0;
                const colors = {
                  science: '#0ea5e9',
                  commerce: '#f97316',
                  arts: '#8b5cf6',
                  vocational: '#10b981'
                };
                return (
                  <div key={stream}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize', color: '#0f1923' }}>
                        {stream}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: colors[stream] }}>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div style={{
                      height: 8,
                      background: '#e5e7eb',
                      borderRadius: 100,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: colors[stream],
                        borderRadius: 100,
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* State Distribution */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 28,
            border: '1px solid #e2d9c8'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f1923', marginBottom: 20 }}>
              📍 Students by State
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(stats.stateBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([state, count], index) => (
                  <div key={state} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: index === 0 ? '#fff7ed' : '#f9fafb',
                    borderRadius: 8,
                    border: `1px solid ${index === 0 ? '#fdba74' : '#e5e7eb'}`
                  }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f1923' }}>
                      {index + 1}. {state}
                    </span>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 700, 
                      color: index === 0 ? '#f97316' : '#6b7280',
                      fontFamily: 'monospace'
                    }}>
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 28,
          border: '1px solid #e2d9c8'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f1923', marginBottom: 20 }}>
            🆕 Recent Signups
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stats.recentSignups.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No signups yet</p>
            ) : (
              stats.recentSignups.map((student, index) => (
                <div key={student.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#faf8f3',
                  borderRadius: 10,
                  border: '1px solid #e2d9c8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f97316, #fb923c)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: 'white',
                      fontWeight: 700
                    }}>
                      {student.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f1923' }}>
                        {student.full_name || 'Anonymous'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {student.district}, {student.state}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280',
                      fontFamily: 'monospace'
                    }}>
                      {new Date(student.created_at).toLocaleDateString()}
                    </div>
                    {student.aptitude_score && (
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#166534',
                        marginTop: 2
                      }}>
                        ✓ Quiz Done
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, value, label, color, animate, capitalize }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animate && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1500;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 24,
      border: '1px solid #e2d9c8',
      transition: 'all 0.2s'
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: 16
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 800,
        color: color,
        marginBottom: 4,
        fontFamily: 'monospace',
        textTransform: capitalize ? 'capitalize' : 'none'
      }}>
        {displayValue}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}