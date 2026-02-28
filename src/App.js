import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasQuizResult, setHasQuizResult] = useState(false);
  const [checkingData, setCheckingData] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkUserData(session.user.id);
      } else {
        setCheckingData(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUserData(userId) {
    const { data } = await supabase
      .from('students')
      .select('full_name, aptitude_score')
      .eq('id', userId)
      .single();

    setHasProfile(!!data?.full_name);
    setHasQuizResult(!!data?.aptitude_score);
    setCheckingData(false);
  }

  function handleProfileComplete() {
    setHasProfile(true);
  }

  function handleQuizComplete() {
    setHasQuizResult(true);
  }

  // Show loading spinner while checking auth
  if (loading || checkingData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#6b7280',
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
          <p>Loading VidyaPath...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in → show Landing or Login
  if (!user) {
    if (showLogin) {
      return <Login onLoginSuccess={setUser} />;
    }
    return <Landing onGetStarted={() => setShowLogin(true)} />;
  }

  // Logged in but no profile → show Profile form
  if (!hasProfile) {
    return <Profile user={user} onProfileComplete={handleProfileComplete} />;
  }

  // Has profile but no quiz result → show Quiz
  if (!hasQuizResult) {
    return <Quiz user={user} onQuizComplete={handleQuizComplete} />;
  }

  // Everything complete → show Dashboard
  return <Dashboard user={user} />;
}

export default App;