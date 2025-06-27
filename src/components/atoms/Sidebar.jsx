import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useTranslation } from 'react-i18next';

const modules = [
  { group: 'Core', items: [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Tenants', path: '/tenants', icon: '🏢' },
    { name: 'Organizations', path: '/organizations', icon: '🏬' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Roles', path: '/roles', icon: '🛡️' },
    { name: 'Privileges', path: '/privileges', icon: '🔑' },
    { name: 'Legal Entities', path: '/legal-entities', icon: '💼' },
  ]},
  { group: 'System', items: [
    { name: 'Audit Log', path: '/audit', icon: '📜' },
    { name: 'Bulk Ops', path: '/bulk', icon: '📦' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Notifications', path: '/notifications', icon: '🔔' },
    { name: 'System Health', path: '/system-health', icon: '❤️' },
  ]}
];

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

const RBAC = {
  'Administrator': {
    core: ['Dashboard', 'Tenants', 'Organizations', 'Users', 'Roles', 'Privileges', 'Legal Entities'],
    advanced: ['Audit Log', 'Bulk Ops', 'Analytics']
  },
  'Tenant Administrator': {
    core: ['Dashboard', 'Organizations', 'Users', 'Roles', 'Privileges', 'Legal Entities'],
    advanced: ['Audit Log', 'Bulk Ops', 'Analytics']
  },
  'User': {
    core: ['Dashboard', 'Users'],
    advanced: []
  }
};

const DEFAULT_ROLE = 'User';

const adminModules = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊', fa: 'fa-tachometer-alt' },
  { name: 'Create Tenant', path: '/tenants', icon: '🏢', fa: 'fa-building' },
  { name: 'Configure Settings', path: '/settings', icon: '⚙️', fa: 'fa-sliders-h' },
  { name: 'Manage Organizations', path: '/organizations', icon: '🏬', fa: 'fa-sitemap' },
  { name: 'Manage Users', path: '/users', icon: '👥', fa: 'fa-users' },
  { name: 'Manage Roles', path: '/roles', icon: '🛡️', fa: 'fa-shield-alt' },
  { name: 'Manage Privileges', path: '/privileges', icon: '🔑', fa: 'fa-key' },
  { name: 'Legal Entity Ops', path: '/legal-entities', icon: '💼', fa: 'fa-briefcase' },
  { name: 'Audit Logs', path: '/audit', icon: '📜', fa: 'fa-file-alt' },
];

const tenantAdminModules = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Organizations', path: '/organizations', icon: '🏬' },
  { name: 'Users', path: '/users', icon: '👥' },
  { name: 'Roles', path: '/roles', icon: '🛡️' },
  { name: 'Privileges', path: '/privileges', icon: '🔑' },
  { name: 'Legal Entities', path: '/legal-entities', icon: '💼' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

const userModules = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

const Sidebar = ({ onClose }) => {
  const [hovered, setHovered] = useState(null);
  const role = useAuthStore(state => state.user?.role || DEFAULT_ROLE);
  const { t } = useTranslation();
  console.debug('[Sidebar] role:', role);
  let modulesToShow;
  if (role === 'ADMINISTRATOR') modulesToShow = adminModules;
  else if (role === 'TENANT_ADMIN' || role === 'Tenant Admin') modulesToShow = tenantAdminModules;
  else if ((role || '').toLowerCase() === 'user') modulesToShow = userModules;
  else modulesToShow = [];
  return (
    <aside
      style={{
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        background: 'var(--card)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        padding: '32px 24px 16px 24px', 
        borderBottom: `1px solid var(--border)`,
        flexShrink: 0
      }}>
        <span style={{ 
          fontFamily: 'Playfair Display, serif', 
          fontSize: 'clamp(24px, 4vw, 36px)', 
          fontWeight: 700, 
          color: 'var(--text)', 
          letterSpacing: '-1.2px',
          wordBreak: 'break-word'
        }}>
          Accessly
        </span>
      </div>
      <nav style={{ 
        marginTop: 32, 
        flex: 1, 
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: 32,
        paddingLeft: 8,
        paddingRight: 8
      }}>
        {modulesToShow.length === 0 && <div style={{ color: '#f87171', padding: 24 }}>No sidebar modules for role: {role}</div>}
        {modulesToShow.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              padding: '16px 20px', 
              borderRadius: 16, 
              marginBottom: 8,
              fontFamily: 'Playfair Display, serif', 
              fontSize: 'clamp(16px, 2.5vw, 20px)', 
              fontWeight: isActive ? 700 : 500, 
              letterSpacing: '0.02em',
              color: isActive ? 'var(--text)' : hovered === item.name ? 'var(--text)' : 'var(--border)',
              background: isActive ? 'var(--input-bg)' : hovered === item.name ? 'var(--card)' : 'transparent',
              borderLeft: isActive ? `4px solid var(--accent)` : '4px solid transparent',
              boxShadow: isActive ? '0 4px 24px 0 #000' : hovered === item.name ? '0 2px 12px 0 #111' : 'none',
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              outline: 'none',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            })}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            onClick={onClose}
          >
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t(item.name)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;