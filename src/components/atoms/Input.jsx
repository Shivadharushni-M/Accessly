import React from 'react';

const Input = React.forwardRef(({ label, error, ...props }, ref) => (
  <div style={{ marginBottom: 24 }}>
    {label && <label style={{ display: 'block', marginBottom: 8, color: '#fff', fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{label}</label>}
    <input
      ref={ref}
      style={{
        width: '100%',
        padding: '14px 20px',
        borderRadius: 10,
        background: '#111',
        color: '#fff',
        border: error ? '1.5px solid #f87171' : '1.5px solid #333',
        fontSize: 16,
        fontFamily: 'Inter, Playfair Display, serif',
        outline: 'none',
        marginBottom: 4
      }}
      {...props}
    />
    {error && <div style={{ color: '#f87171', fontSize: 14, marginTop: 4 }}>{error}</div>}
  </div>
));

export default Input; 