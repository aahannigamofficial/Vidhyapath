export default function Loading({ message = 'Loading...' }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
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
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{message}</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}