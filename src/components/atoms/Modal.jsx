import React from 'react';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      transition: 'opacity 0.2s'
    }}>
      <div style={{
        background: '#18181b',
        borderRadius: 24,
        boxShadow: '0 8px 48px 0 #000a',
        padding: 32,
        width: '100%',
        maxWidth: 480,
        position: 'relative',
        animation: 'fadeIn 0.2s'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#bdbdbd',
            background: 'none',
            border: 'none',
            fontSize: 28,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
        >×</button>
        {title && (
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 24,
            color: '#fff',
            letterSpacing: '-0.03em',
            textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4'
          }}>{title}</h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal; 