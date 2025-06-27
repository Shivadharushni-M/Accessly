import React from 'react';
import { useTranslation } from 'react-i18next';

const BulkOps = () => {
  const { t } = useTranslation();
  return (
    <div style={{
      padding: '32px',
      background: 'var(--bg)',
      minHeight: '100vh',
      color: 'var(--text)',
      fontFamily: 'Inter, Playfair Display, JetBrains Mono, sans-serif',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100vw'
    }}>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 700,
        color: 'var(--text)',
        margin: 0,
        letterSpacing: '-0.03em',
        textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4'
      }}>{t('Bulk Operations')}</h1>
      <div style={{
        marginTop: 32,
        background: 'var(--card)',
        borderRadius: 24,
        boxShadow: '0 8px 48px 0 #000a',
        padding: 32,
        color: 'var(--text)',
        fontSize: 18
      }}>
        <p>{t('Import/export users, roles, privileges, and more. (Feature coming soon!)')}</p>
      </div>
    </div>
  );
};

export default BulkOps; 