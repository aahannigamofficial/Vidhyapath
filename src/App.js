import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkUserData(session.user.id);
      } else {
        setCheckingData(false);
      }
    });

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

  if (loading || checkingData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    );
  }

  // Not logged in → show Login
  if (!user) {
    return <Login onLoginSuccess={setUser} />;
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
