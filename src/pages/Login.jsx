import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setLoading(true);
    setMessage('');

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) {
        setMessage('❌ ' + error.message);
      } else {
        setMessage('✅ Account created! Check your email to verify, then log in.');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        setMessage('❌ ' + error.message);
      } else {
        setMessage('✅ Logged in successfully!');
        onLoginSuccess(data.user);
      }
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#faf8f3',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'white',
        padding: 40,
        borderRadius: 16,
        border: '1px solid #e2d9c8',
        boxShadow: '0 2px 12px rgba(15,25,35,0.08)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#f97316',
          textAlign: 'center',
          marginBottom: 8
        }}>
          🎓 VidyaPath
        </h1>
        <p style={{
          color: '#6b7280',
          textAlign: 'center',
          fontSize: '0.9rem',
          marginBottom: 32
        }}>
          {isSignup ? 'Create your free account' : 'Welcome back, log in to continue'}
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              fontSize: '1rem',
              border: '2px solid #e2d9c8',
              borderRadius: 10,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              fontSize: '1rem',
              border: '2px solid #e2d9c8',
              borderRadius: 10,
              outline: 'none'
            }}
          />
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            background: loading ? '#9ca3af' : '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 16
          }}
        >
          {loading ? 'Processing...' : (isSignup ? '🚀 Create Account' : '🔓 Log In')}
        </button>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.9rem',
          cursor: 'pointer',
          marginBottom: 16
        }} onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? '← Already have an account? Log in' : "Don't have an account? Sign up →"}
        </p>

        {message && (
          <div style={{
            padding: 12,
            borderRadius: 8,
            background: message.startsWith('✅') ? '#f0fdf4' : '#fef2f2',
            color: message.startsWith('✅') ? '#166534' : '#991b1b',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
