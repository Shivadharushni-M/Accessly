import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    toast.error('An unexpected error occurred. Our team has been notified.');
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000 0%, #18181b 100%)',
          color: '#fff',
          fontFamily: 'Inter, Playfair Display, JetBrains Mono, sans-serif',
        }}>
          <div style={{
            background: 'rgba(20,20,20,0.7)',
            borderRadius: '32px',
            boxShadow: '0 8px 48px 0 #000a',
            border: '1.5px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            padding: '48px 40px',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
          }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 16px 0',
              letterSpacing: '-0.03em',
              textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4',
            }}>{t('Something went wrong')}</h1>
            <p style={{
              color: '#bdbdbd',
              fontSize: 18,
              margin: 0,
              fontWeight: 400,
              letterSpacing: '0.3px',
              fontFamily: 'Inter, Playfair Display, serif',
            }}>{t('Please refresh the page or contact support')}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary); 