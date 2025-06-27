import React from 'react';

const SkeletonTable = ({ rows = 5, cols = 3 }) => (
  <div style={{
    width: '100%',
    background: '#18181b',
    borderRadius: 24,
    boxShadow: '0 8px 48px 0 #000a',
    overflow: 'hidden',
    marginTop: 24,
    animation: 'pulse 1.5s infinite',
  }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {[...Array(cols)].map((_, i) => (
            <th key={i} style={{ padding: '18px 24px', textAlign: 'left' }}>
              <div style={{ height: 16, background: '#232323', borderRadius: 8, width: '75%', opacity: 0.7 }} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, r) => (
          <tr key={r} style={{ borderBottom: '1px solid #222' }}>
            {[...Array(cols)].map((_, c) => (
              <td key={c} style={{ padding: '18px 24px' }}>
                <div style={{ height: 16, background: '#232323', borderRadius: 8, width: '100%', opacity: 0.7 }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SkeletonTable; 