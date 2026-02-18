import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkProfile(session.user.id);
      } else {
        setCheckingProfile(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkProfile(userId) {
    const { data } = await supabase
      .from('students')
      .select('full_name')
      .eq('id', userId)
      .single();

    setHasProfile(!!data?.full_name);
    setCheckingProfile(false);
  }

  function handleProfileComplete() {
    setHasProfile(true);
  }

  if (loading || checkingProfile) {
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

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  if (!hasProfile) {
    return <Profile user={user} onProfileComplete={handleProfileComplete} />;
  }

  return <Dashboard user={user} />;
}

export default App;