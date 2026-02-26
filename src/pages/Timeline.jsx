import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getPersonalizedTimeline } from '../data/timelineData';

export default function Timeline({ user }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    const { data } = await supabase
      .from('students')
      .select('state, stream, aptitude_score')
      .eq('id', user.id)
      .single();

    if (data) {
      const stream = data.aptitude_score?.topStream || data.stream || 'science';
      setStudentInfo({ state: data.state, stream });
      
      const personalizedEvents = getPersonalizedTimeline(data.state, stream);
      setEvents(personalizedEvents);
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
        <p style={{ color: '#6b7280' }}>Loading your timeline...</p>
      </div>
    );
  }

  const completedEvents = events.filter(e => e.status === 'completed');
  const openEvents = events.filter(e => e.status === 'open');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f1923', marginBottom: 8 }}>
          📅 Your Important Dates
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: 8 }}>
          Never miss an admission, scholarship, or exam deadline
        </p>
        {studentInfo && (
          <p style={{ 
            color: '#f97316', 
            fontSize: '0.9rem', 
            fontWeight: 600,
            marginBottom: 32 
          }}>
            Showing deadlines for: {studentInfo.state} · {studentInfo.stream.charAt(0).toUpperCase() + studentInfo.stream.slice(1)} Stream
          </p>
        )}

        {openEvents.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: '#166534',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              🟢 OPEN NOW — Action Required!
            </h2>
            {openEvents.map(event => (
              <TimelineCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {upcomingEvents.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: '#0369a1',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              📅 UPCOMING
            </h2>
            {upcomingEvents.map(event => (
              <TimelineCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {completedEvents.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: '#6b7280',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              ✅ COMPLETED
            </h2>
            {completedEvents.map(event => (
              <TimelineCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineCard({ event }) {
  const statusColors = {
    open: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', badge: '#22c55e' },
    upcoming: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', badge: '#3b82f6' },
    completed: { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280', badge: '#9ca3af' }
  };

  const colors = statusColors[event.status] || statusColors.upcoming;
  
  // Custom Date parser for display to avoid Timezone Offset issues
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const dateRange = event.startDate === event.endDate 
    ? formatDate(event.startDate)
    : `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`;

  // Logic to handle "0 days left" (meaning it ends today)
  const getDaysLabel = () => {
    if (event.status === 'open') {
        if (event.daysRemaining === 0) return '⏰ Ends TODAY';
        return `⏰ ${event.daysRemaining} day${event.daysRemaining !== 1 ? 's' : ''} left`;
    }
    return `📍 Starts in ${event.daysRemaining} day${event.daysRemaining !== 1 ? 's' : ''}`;
  };

  return (
    <div style={{
      background: 'white',
      border: `2px solid ${colors.border}`,
      borderRadius: 12,
      padding: 24,
      marginBottom: 16,
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: -12,
        left: 20,
        background: colors.badge,
        color: 'white',
        padding: '4px 12px',
        borderRadius: 100,
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        {event.status === 'open' ? '🔥 Open' : 
         event.status === 'upcoming' ? '📌 Upcoming' : '✓ Done'}
      </div>

      <p style={{ 
        fontSize: '0.85rem', 
        color: '#6b7280',
        fontWeight: 600,
        marginBottom: 8,
        marginTop: 4
      }}>
        📆 {dateRange}
      </p>

      <h3 style={{ 
        fontSize: '1.1rem', 
        fontWeight: 700, 
        color: '#0f1923',
        marginBottom: 8
      }}>
        {event.title}
      </h3>

      <p style={{ 
        fontSize: '0.9rem', 
        color: '#6b7280',
        lineHeight: 1.6,
        marginBottom: 12
      }}>
        {event.description}
      </p>

      {event.daysRemaining !== null && (
        <div style={{
          display: 'inline-block',
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          padding: '6px 12px',
          borderRadius: 8,
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: event.url ? 12 : 0
        }}>
          {getDaysLabel()}
        </div>
      )}

      {event.url && event.status !== 'completed' && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: event.daysRemaining ? 0 : 12,
            marginLeft: event.daysRemaining ? 12 : 0,
            padding: '8px 16px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Apply Now →
        </a>
      )}

      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        padding: '4px 10px',
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: 100,
        fontSize: '0.7rem',
        fontWeight: 600,
        color: '#6b7280',
        textTransform: 'capitalize'
      }}>
        {event.type === 'admission' ? '🎓' : 
         event.type === 'scholarship' ? '💰' :
         event.type === 'exam' ? '📝' :
         event.type === 'counseling' ? '🗣️' : '📌'} {event.type}
      </div>
    </div>
  );
}