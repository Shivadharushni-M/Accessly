import React from 'react';

const Analytics = () => (
  <div style={{
    padding: '32px',
    background: '#000',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: 'Inter, Playfair Display, JetBrains Mono, sans-serif',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100vw'
  }}>
    <h1 style={{
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(32px, 5vw, 48px)',
      fontWeight: 700,
      color: '#fff',
      margin: 0,
      letterSpacing: '-0.03em',
      textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4'
    }}>Analytics</h1>
    <div style={{
      marginTop: 32,
      background: '#18181b',
      borderRadius: 24,
      boxShadow: '0 8px 48px 0 #000a',
      padding: 32,
      color: '#bdbdbd',
      fontSize: 18
    }}>
      <p>Charts and data visualizations coming soon!</p>
    </div>
  </div>
);

export default Analytics; 