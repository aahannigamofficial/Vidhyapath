import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import MarksheetScanner from '../components/MarksheetScanner';

export default function Profile({ user, onProfileComplete }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentClass, setCurrentClass] = useState('Class 12');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setFullName(data.full_name || '');
      setMobile(data.mobile || '');
      setCurrentClass(data.current_class || 'Class 12');
      setState(data.state || '');
      setDistrict(data.district || '');
      setLanguage(data.language || 'English');
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('students')
      .upsert({
        id: user.id,
        full_name: fullName,
        mobile: mobile,
        current_class: currentClass,
        state: state,
        district: district,
        language: language
      });

    if (error) {
      setMessage('❌ Error saving profile: ' + error.message);
    } else {
      setMessage('✅ Profile saved successfully!');
      setTimeout(() => onProfileComplete(), 1500);
    }
    setSaving(false);
  }

  function handleScannedData(data) {
    if (data.fullName) {
      setFullName(data.fullName);
    }
    if (data.percentage) {
      setMessage(`✨ Detected ${data.percentage}% in marksheet!`);
    }
    if (data.suggestedStream) {
      setMessage(msg => (msg ? msg + ` Stream detected: ${data.suggestedStream}` : `✨ Stream detected: ${data.suggestedStream}`));
    }
  }

  if (loading) {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        background: 'white',
        borderRadius: 16,
        padding: 40,
        border: '1px solid #e2d9c8'
      }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0f1923', marginBottom: 8 }}>
          📝 Complete Your Profile
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: 32 }}>
          Tell us about yourself so we can personalize your experience
        </p>

        {/* Marksheet Scanner */}
        <MarksheetScanner onDataExtracted={handleScannedData} />

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
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

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            Mobile Number *
          </label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
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

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            Current Class *
          </label>
          <select
            value={currentClass}
            onChange={e => setCurrentClass(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              fontSize: '1rem',
              border: '2px solid #e2d9c8',
              borderRadius: 10,
              outline: 'none',
              background: 'white'
            }}
          >
            <option>Class 10</option>
            <option>Class 11</option>
            <option>Class 12</option>
            <option>Graduated Class 12</option>
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            State *
          </label>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              fontSize: '1rem',
              border: '2px solid #e2d9c8',
              borderRadius: 10,
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="">Select your state</option>
            <option>Bihar</option>
            <option>Uttar Pradesh</option>
            <option>Madhya Pradesh</option>
            <option>Rajasthan</option>
            <option>Odisha</option>
            <option>Jharkhand</option>
            <option>West Bengal</option>
            <option>Chhattisgarh</option>
            <option>Maharashtra</option>
            <option>Tamil Nadu</option>
            <option>Karnataka</option>
            <option>Andhra Pradesh</option>
            <option>Telangana</option>
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            District *
          </label>
          <input
            type="text"
            placeholder="Your district"
            value={district}
            onChange={e => setDistrict(e.target.value)}
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

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#0f1923' }}>
            Preferred Language *
          </label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              fontSize: '1rem',
              border: '2px solid #e2d9c8',
              borderRadius: 10,
              outline: 'none',
              background: 'white'
            }}
          >
            <option>English</option>
            <option>हिन्दी (Hindi)</option>
            <option>বাংলা (Bengali)</option>
            <option>मराठी (Marathi)</option>
            <option>తెలుగు (Telugu)</option>
            <option>தமிழ் (Tamil)</option>
            <option>ગુજરાતી (Gujarati)</option>
            <option>ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !fullName || !mobile || !state || !district}
          style={{
            width: '100%',
            padding: 14,
            background: (saving || !fullName || !mobile || !state || !district) ? '#9ca3af' : '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 700,
            cursor: (saving || !fullName || !mobile || !state || !district) ? 'not-allowed' : 'pointer',
            marginBottom: 16
          }}
        >
          {saving ? 'Saving...' : '💾 Save Profile'}
        </button>

        {message && (
          <div style={{
            padding: 12,
            borderRadius: 8,
            background: message.startsWith('✅') || message.startsWith('✨') ? '#f0fdf4' : '#fef2f2',
            color: message.startsWith('✅') || message.startsWith('✨') ? '#166534' : '#991b1b',
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