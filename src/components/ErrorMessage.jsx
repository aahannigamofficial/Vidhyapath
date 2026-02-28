export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      background: '#faf8f3',
      padding: 32
    }}>
      <div style={{
        maxWidth: 500,
        background: 'white',
        borderRadius: 16,
        padding: 40,
        border: '2px solid #fecaca',
        textAlign: 'center'
      }}>
        <div style={{
          width: 60,
          height: 60,
          background: '#fee2e2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '1.8rem'
        }}>
          ⚠️
        </div>
        <h2 style={{ fontSize: '1.3rem', color: '#991b1b', marginBottom: 12 }}>
          Something went wrong
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
          {message || 'An unexpected error occurred. Please try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '12px 24px',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}