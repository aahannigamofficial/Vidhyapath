export default function Landing({ onGetStarted }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf8f3 0%, #fff7ed 100%)',
      fontFamily: 'sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 32px',
        textAlign: 'center'
      }}>
        <div style={{
          width: 100,
          height: 100,
          background: 'linear-gradient(135deg, #f97316, #fb923c)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          margin: '0 auto 24px'
        }}>
          🎓
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: '#0f1923',
          marginBottom: 16,
          fontWeight: 800,
          lineHeight: 1.2
        }}>
          Welcome to VidyaPath
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          color: '#6b7280',
          maxWidth: 700,
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          India's first AI-powered career guidance platform for government college students. 
          Discover your perfect stream, find nearby colleges, and never miss an admission deadline.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            style={{
              padding: '16px 32px',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(249,115,22,0.3)'
            }}
          >
            Get Started Free →
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
          marginTop: 80,
          maxWidth: 900,
          margin: '80px auto 0'
        }}>
          {[
            { num: '4,800+', label: 'Government Colleges' },
            { num: '1.2L+', label: 'Students Guided' },
            { num: '38+', label: 'Career Paths' },
            { num: '100%', label: 'Free Forever' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#f97316',
                marginBottom: 8
              }}>
                {stat.num}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#6b7280' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginTop: 80
        }}>
          {[
            { icon: '🧠', title: 'Aptitude Quiz', desc: 'Find your perfect stream in 5 minutes' },
            { icon: '🏫', title: 'College Search', desc: '12 government colleges with filters' },
            { icon: '🤖', title: 'AI Guidance', desc: 'Personalized recommendations' },
            { icon: '📅', title: 'Deadline Tracker', desc: 'Never miss important dates' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'white',
              padding: 32,
              borderRadius: 16,
              border: '1px solid #e2d9c8',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f1923', marginBottom: 8 }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}