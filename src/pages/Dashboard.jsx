import { supabase } from '../supabaseClient';

export default function Dashboard({ user }) {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
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
          <p style={{ color: '#166534', fontSize: '0.95rem', lineHeight: 1.6 }}>
            ✅ Your account is active! Next steps: <br/>
            • Complete your student profile<br/>
            • Take the aptitude quiz<br/>
            • Explore career paths
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
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