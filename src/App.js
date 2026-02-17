import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [status, setStatus] = useState('Checking connection...');

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from('students')
        .select('id')
        .limit(1);

      if (error) {
        setStatus('❌ Connection failed — ' + error.message);
      } else {
        setStatus('✅ Supabase connected successfully!');
      }
    }
    testConnection();
  }, []);

  return (
    <div style={{
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '80px 20px'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#f97316' }}>
        🎓 VidyaPath
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1.1rem', marginTop: 12 }}>
        Your Career & Education Guide
      </p>
      <div style={{
        marginTop: 40, padding: '20px 32px',
        background: '#f0fdf4', borderRadius: 12,
        display: 'inline-block', fontSize: '1rem', color: '#166534'
      }}>
        {status}
      </div>
    </div>
  );
}

export default App;
