import React from 'react';

const mockLogs = [
  { id: 1, action: 'User John Doe created', time: '2 min ago', actor: 'admin', resource: 'User' },
  { id: 2, action: 'Tenant Acme Corp updated', time: '10 min ago', actor: 'sysadmin', resource: 'Tenant' },
  { id: 3, action: 'Role Manager deleted', time: '1 hour ago', actor: 'tenantadmin', resource: 'Role' }
];

const AuditLog = () => (
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
    }}>Audit Log</h1>
    <div style={{
      overflowX: 'auto',
      borderRadius: '24px',
      boxShadow: '0 8px 48px 0 #000a',
      background: '#18181b',
      marginTop: 24
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #222' }}>
            <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Action</th>
            <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Time</th>
            <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Actor</th>
            <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Resource</th>
          </tr>
        </thead>
        <tbody>
          {mockLogs.map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', background: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#232323'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <td style={{ padding: '18px 24px' }}>{log.action}</td>
              <td style={{ padding: '18px 24px' }}>{log.time}</td>
              <td style={{ padding: '18px 24px' }}>{log.actor}</td>
              <td style={{ padding: '18px 24px' }}>{log.resource}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AuditLog; 