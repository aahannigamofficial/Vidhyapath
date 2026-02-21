import { supabase } from '../supabaseClient';
import { useState } from 'react';
import CareerPaths from './CareerPaths';
import CollegeDirectory from './CollegeDirectory';

export default function Dashboard({ user }) {
  const [currentView, setCurrentView] = useState('dashboard');

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (currentView === 'career-paths') {
    return (
      <div>
        <div style={{
          padding: '16px 32px',
          background: 'white',
          borderBottom: '1px solid #e2d9c8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setCurrentView('dashboard')}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#6b7280',
              border: '2px solid #e2d9c8',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
          <button onClick={handleLogout} style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#6b7280',
            border: '2px solid #e2d9c8',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            🚪 Log Out
          </button>
        </div>
        <CareerPaths />
      </div>
    );
  }

  if (currentView === 'colleges') {
    return (
      <div>
        <div style={{
          padding: '16px 32px',
          background: 'white',
          borderBottom: '1px solid #e2d9c8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setCurrentView('dashboard')}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#6b7280',
              border: '2px solid #e2d9c8',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
          <button onClick={handleLogout} style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#6b7280',
            border: '2px solid #e2d9c8',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            🚪 Log Out
          </button>
        </div>
        <CollegeDirectory user={user} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        background: 'white',
        borderRadius: 16,
        padding: 40,
        border: '1px solid #e2d9c8'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316, #fb923c)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🧑‍🎓
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f1923', marginBottom: 8 }}>
            Welcome to VidyaPath!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Logged in as: <strong>{user.email}</strong>
          </p>
        </div>

        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <p style={{ color: '#166534', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 16 }}>
            ✅ Your account is active! You've completed:
          </p>
          <ul style={{ color: '#166534', fontSize: '0.9rem', marginLeft: 20, lineHeight: 1.8 }}>
            <li>Profile setup ✓</li>
            <li>Aptitude quiz ✓</li>
          </ul>
        </div>

        <button
          onClick={() => setCurrentView('colleges')}
          style={{
            width: '100%',
            padding: 16,
            background: '#166534',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 12
          }}
        >
          🏫 Browse Government Colleges →
        </button>

        <button
          onClick={() => setCurrentView('career-paths')}
          style={{
            width: '100%',
            padding: 16,
            background: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 12
          }}
        >
          🗺️ Explore Career Paths →
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: 'transparent',
            color: '#6b7280',
            border: '2px solid #e2d9c8',
            borderRadius: 10,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}