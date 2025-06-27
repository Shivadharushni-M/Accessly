import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useRBACStore from '../store/rbacStore';
import { ROLE_PERMISSIONS } from '../config/permissions';
import Sidebar from '../components/atoms/Sidebar';
import { createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import { setLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

const credColors = {
  black: '#000000',
  charcoal: '#18181b',
  darkGrey: '#2a2a2a',
  mediumGrey: '#666666',
  lightGrey: '#a8a8a8',
  white: '#ffffff',
  borderGrey: '#333333',
  inputBg: '#111111',
};

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Tenants', path: '/tenants' },
  { label: 'Users', path: '/users' },
  { label: 'Roles', path: '/roles' },
  { label: 'Privileges', path: '/privileges' },
  { label: 'Organizations', path: '/organizations' },
  { label: 'Legal Entities', path: '/legal-entities' }
];

const ROLES = ['ADMINISTRATOR', 'TENANT_ADMIN', 'ORG_MANAGER', 'USER', 'VIEWER'];

const getBreadcrumbs = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  let path = '';
  return parts.map((part, i) => {
    path += '/' + part;
    return (
      <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Link 
          to={path} 
          style={{ 
            color: credColors.lightGrey, 
            fontFamily: 'Playfair Display, serif', 
            fontWeight: 500, 
            fontSize: 'clamp(14px, 2vw, 18px)', 
            textDecoration: 'none', 
            marginRight: 4,
            whiteSpace: 'nowrap'
          }}
        >
          {part.charAt(0).toUpperCase() + part.slice(1)}
        </Link>
        {i < parts.length - 1 && (
          <span style={{ 
            color: credColors.mediumGrey, 
            margin: '0 4px',
            fontSize: 'clamp(12px, 1.5vw, 16px)'
          }}>
            /
          </span>
        )}
      </span>
    );
  });
};

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use environment variable or fallback to prevent connection errors
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    
    try {
      const s = io(socketUrl, {
        timeout: 5000,
        forceNew: true,
        reconnection: false // Disable reconnection to prevent errors
      });
      
      s.on('connect_error', (error) => {
        console.warn('Socket connection failed, continuing without real-time features:', error.message);
      });
      
      setSocket(s);
      return () => s.disconnect();
    } catch (error) {
      console.warn('Socket initialization failed, continuing without real-time features:', error);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, showLogoutDialog, confirmLogout, cancelLogout } = useAuthStore();
  const { setPermissions } = useRBACStore();
  const [role, setRole] = useState(user?.role || 'USER');
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const { t } = useTranslation();

  useEffect(() => {
    // Set permissions on mount or user change
    if (user?.role && ROLE_PERMISSIONS[user.role]) {
      const perms = ROLE_PERMISSIONS[user.role];
      setPermissions(
        perms.reduce((acc, p) => {
          const [resource, action] = p.split(':');
          if (!acc[resource]) acc[resource] = [];
          acc[resource].push(action);
          return acc;
        }, {})
      );
    }
  }, [user, setPermissions]);

  useEffect(() => {
    // Set a class or data attribute on the root element for theme
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    document.body.style.background = dark ? '#000' : '#fff';
    document.body.style.color = dark ? '#fff' : '#000';
  }, [dark]);

  const handleLogout = () => {
    // Only show dialog, never use window.confirm
    logout();
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setPermissions(
      Object.entries(ROLE_PERMISSIONS).reduce((acc, [roleKey, perms]) => {
        if (roleKey === newRole) {
          perms.forEach(p => {
            const [resource, action] = p.split(':');
            if (!acc[resource]) acc[resource] = [];
            acc[resource].push(action);
          });
        }
        return acc;
      }, {})
    );
  };

  const handleThemeToggle = () => setDark(d => !d);

  // Add debug log for dialog
  useEffect(() => {
    if (showLogoutDialog) {
      console.debug('[LAYOUT] Logout dialog is being shown');
    }
  }, [showLogoutDialog]);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: credColors.black,
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Hamburger Menu Button (always visible) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Open sidebar menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 2000,
          background: 'rgba(24,24,24,0.95)',
          border: '1.5px solid #333',
          borderRadius: '12px',
          color: '#fff',
          padding: '10px',
          cursor: 'pointer',
          boxShadow: '0 2px 12px #0008',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Elegant Hamburger SVG */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="6" width="28" height="2.5" rx="1.25" fill="#fff"/>
          <rect y="13" width="28" height="2.5" rx="1.25" fill="#fff"/>
          <rect y="20" width="28" height="2.5" rx="1.25" fill="#fff"/>
        </svg>
      </button>
      {/* Sidebar Overlay (toggle for all screen sizes) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: 256,
        background: credColors.inputBg,
        boxShadow: '0 0 32px 0 #000',
        borderRight: `1px solid ${credColors.borderGrey}`,
        zIndex: 999,
        display: sidebarOpen ? 'block' : 'none',
        transition: 'all 0.2s',
      }}>
        {/* Close icon always visible when sidebar is open */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar menu"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(24,24,24,0.95)',
              border: '1.5px solid #333',
              borderRadius: '12px',
              color: '#fff',
              padding: '8px',
              cursor: 'pointer',
              zIndex: 2001,
              boxShadow: '0 2px 12px #0008',
              transition: 'background 0.2s, box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Elegant Close SVG */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="5" x2="17" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="17" y1="5" x2="5" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      {/* Backdrop overlay always when sidebar is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 998,
            transition: 'background 0.2s',
          }}
        />
      )}
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          marginLeft: '0',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          background: credColors.black,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="main-content"
      >
        {/* Topbar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 48px)', 
          borderBottom: `1px solid ${credColors.borderGrey}`, 
          background: credColors.charcoal, 
          position: 'sticky', 
          top: 0, 
          zIndex: 30, 
          boxShadow: '0 2px 24px 0 #000',
          minHeight: '60px',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            fontFamily: 'Playfair Display, serif', 
            fontSize: 'clamp(16px, 3vw, 22px)', 
            fontWeight: 600, 
            letterSpacing: '0.02em', 
            color: credColors.white,
            overflow: 'hidden',
            flex: 1,
            marginLeft: 'clamp(0px, 5vw, 0px)'
          }} className="ml-0 md:ml-0">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              overflow: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {getBreadcrumbs(location.pathname)}
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(16px, 3vw, 32px)',
            flexShrink: 0
          }}>
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              aria-label={t('Dark') + '/' + t('Light')}
              style={{
                background: dark ? '#232323' : '#e5e5e5',
                border: '1.5px solid #333',
                borderRadius: '10px',
                color: dark ? '#fff' : '#000',
                padding: '10px 18px',
                fontFamily: 'Inter, Playfair Display, serif',
                fontWeight: 600,
                fontSize: 'clamp(15px, 2vw, 18px)',
                cursor: 'pointer',
                marginLeft: 12,
                boxShadow: '0 2px 12px #0008',
                transition: 'background 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {dark ? '🌙 ' + t('Dark') : '☀️ ' + t('Light')}
            </button>
            {/* Notifications area */}
            <span style={{ 
              color: credColors.lightGrey, 
              fontFamily: 'Playfair Display, serif', 
              fontWeight: 500, 
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              whiteSpace: 'nowrap',
              display: 'none'
            }} className="hidden sm:inline">
              🔔 Notifications
            </span>
            <span style={{ 
              color: credColors.lightGrey, 
              fontSize: 'clamp(18px, 3vw, 24px)',
              cursor: 'pointer'
            }} className="sm:hidden">
              🔔
            </span>
            {/* Language Toggle Button */}
            <button
              onClick={() => {
                const newLang = lang === 'en' ? 'ta' : 'en';
                setLang(newLang);
                setLanguage(newLang);
              }}
              aria-label={t('English') + '/' + t('Tamil')}
              style={{
                background: dark ? '#232323' : '#e5e5e5',
                border: '1.5px solid #333',
                borderRadius: '10px',
                color: dark ? '#fff' : '#000',
                padding: '10px 18px',
                fontFamily: 'Inter, Playfair Display, serif',
                fontWeight: 600,
                fontSize: 'clamp(15px, 2vw, 18px)',
                cursor: 'pointer',
                marginLeft: 12,
                boxShadow: '0 2px 12px #0008',
                transition: 'background 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {lang === 'en' ? '🇬🇧 ' + t('English') : '🇮🇳 ' + t('Tamil')}
            </button>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(24,24,24,0.95)',
                border: '1.5px solid #333',
                borderRadius: '10px',
                color: '#fff',
                padding: '10px 18px',
                fontFamily: 'Inter, Playfair Display, serif',
                fontWeight: 600,
                fontSize: 'clamp(15px, 2vw, 18px)',
                cursor: 'pointer',
                marginLeft: 12,
                boxShadow: '0 2px 12px #0008',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              Logout
            </button>
          </div>
        </div>
        
        <main style={{ 
          flex: 1, 
          width: '100%', 
          padding: 0,
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
      
      {showLogoutDialog && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'rgba(0,0,0,0.8)', 
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{ 
            background: credColors.white, 
            padding: 'clamp(24px, 4vw, 32px)', 
            borderRadius: 16, 
            boxShadow: '0 8px 32px 0 #000', 
            width: '100%',
            maxWidth: '320px'
          }}>
            <h2 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: 'clamp(18px, 3vw, 22px)', 
              fontWeight: 700, 
              marginBottom: 16,
              margin: '0 0 16px 0'
            }}>
              Confirm Logout
            </h2>
            <p style={{ 
              marginBottom: 24, 
              color: credColors.darkGrey,
              fontSize: 'clamp(14px, 2vw, 16px)',
              margin: '0 0 24px 0'
            }}>
              Are you sure you want to logout?
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 12,
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={cancelLogout} 
                style={{ 
                  padding: '8px 24px', 
                  borderRadius: 8, 
                  background: credColors.lightGrey, 
                  color: credColors.black, 
                  border: 'none', 
                  fontWeight: 500, 
                  fontFamily: 'Montserrat, sans-serif', 
                  cursor: 'pointer',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  minWidth: '80px'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout} 
                style={{ 
                  padding: '8px 24px', 
                  borderRadius: 8, 
                  background: '#e11d48', 
                  color: credColors.white, 
                  border: 'none', 
                  fontWeight: 500, 
                  fontFamily: 'Montserrat, sans-serif', 
                  cursor: 'pointer',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  minWidth: '80px'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout; 
