import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const credColors = {
  black: '#000000',
  charcoal: '#0a0a0a',
  darkGrey: '#1a1a1a',
  mediumGrey: '#2a2a2a',
  lightGrey: '#666666',
  accent: '#8a8a8a',
  white: '#ffffff',
  borderGrey: '#1f1f1f',
  inputBg: '#111111',
  cardBg: '#121212',
  hoverBg: '#161616',
};

const Button = ({ variant, children, onClick, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '14px 20px',
        borderRadius: '12px',
        border: variant === 'outline' ? `1px solid ${credColors.borderGrey}` : 'none',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 500,
        fontSize: '14px',
        cursor: 'pointer',
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
          : variant === 'outline' 
            ? (isHovered ? credColors.hoverBg : 'transparent')
            : credColors.mediumGrey,
        color: credColors.white,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        whiteSpace: 'nowrap',
        width: '100%',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.4)' : 'none',
        borderColor: variant === 'outline' && isHovered ? credColors.lightGrey : credColors.borderGrey,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const overviewByRole = {
  'Administrator': [
    { label: 'Tenants', value: 4, icon: '\ud83c\udfe2', trend: '+12%', color: '#4ade80' },
    { label: 'Organizations', value: 8, icon: '\ud83c\udfec', trend: '+8%', color: '#60a5fa' },
    { label: 'Users', value: 32, icon: '\ud83d\udc64', trend: '+24%', color: '#f472b6' },
    { label: 'Roles', value: 6, icon: '\ud83d\udd11', trend: '+5%', color: '#fbbf24' },
    { label: 'Privileges', value: 18, icon: '\ud83d\udee1\ufe0f', trend: '+2%', color: '#a78bfa' },
    { label: 'Legal Entities', value: 3, icon: '\ud83d\udcc4', trend: '+1%', color: '#f87171' },
  ],
  'Tenant Admin': [
    { label: 'Organizations', value: 8, icon: '🏬', trend: '+8%', color: '#60a5fa' },
    { label: 'Users', value: 32, icon: '👤', trend: '+24%', color: '#f472b6' },
    { label: 'Roles', value: 6, icon: '🔑', trend: '+5%', color: '#fbbf24' },
    { label: 'Privileges', value: 18, icon: '🛡️', trend: '+2%', color: '#a78bfa' },
    { label: 'Legal Entities', value: 3, icon: '📄', trend: '+1%', color: '#f87171' },
  ],
  'User': [
    { label: 'Users', value: 1, icon: '👤', trend: '+0%', color: '#f472b6' },
  ],
};

const onboardingTips = {
  ADMINISTRATOR: [
    'Create a new tenant to get started.',
    'Configure tenant settings and invite Tenant Admins.',
    'Monitor system activity in the Audit Log.'
  ],
  TENANT_ADMIN: [
    'Review and approve pending user registrations.',
    'Set up organizations and assign managers.',
    'Assign roles and privileges to users.'
  ],
  USER: [
    'Update your profile information.',
    'Explore modules you have access to.',
    'Request additional access if needed.'
  ]
};

const adminQuickActions = [
  { label: 'Create Tenant', icon: '🏢', path: '/tenants' },
  { label: 'Configure Settings', icon: '⚙️', path: '/settings' },
  { label: 'Manage Organizations', icon: '🏬', path: '/organizations' },
  { label: 'Manage Users', icon: '👥', path: '/users' },
  { label: 'Manage Roles', icon: '🛡️', path: '/roles' },
  { label: 'Manage Privileges', icon: '🔑', path: '/privileges' },
  { label: 'Legal Entity Ops', icon: '💼', path: '/legal-entities' },
  { label: 'Audit Logs', icon: '📜', path: '/audit' },
];

const tenantAdminQuickActions = [
  { label: 'Manage Organizations', icon: '🏬', path: '/organizations' },
  { label: 'Manage Users', icon: '👥', path: '/users' },
  { label: 'Manage Roles', icon: '🛡️', path: '/roles' },
  { label: 'Manage Privileges', icon: '🔑', path: '/privileges' },
  { label: 'Legal Entity Ops', icon: '💼', path: '/legal-entities' },
  { label: 'Profile', icon: '👤', path: '/profile' },
];

function toTitleCase(str) {
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = useAuthStore(state => state.user?.role || 'User');
  const canonicalRole = (role || '').toUpperCase().replace(/ /g, '_');
  const tips = onboardingTips[canonicalRole] || onboardingTips['USER'];
  const isAdmin = role === 'ADMINISTRATOR';
  const isTenantAdmin = role === 'TENANT_ADMIN' || role === 'Tenant Admin';
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [tenantsRes, usersRes, rolesRes, activityRes] = await Promise.all([
          apiService.get('/api/v1/tenants'),
          apiService.get('/api/v1/tenants/1/users'),
          apiService.get('/api/v1/tenants/1/roles'),
          apiService.get('/api/v1/activity-logs'),
        ]);
        setTenants(Array.isArray(tenantsRes) ? tenantsRes : []);
        setUsers(Array.isArray(usersRes) ? usersRes : []);
        setRoles(Array.isArray(rolesRes) ? rolesRes : []);
        setActivityLogs(Array.isArray(activityRes) ? activityRes : []);
      } catch (e) {
        setTenants([]); setUsers([]); setRoles([]); setActivityLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Overview cards (real-time)
  const overview = [
    { label: 'Tenants', value: tenants.length, icon: '🏢', color: '#4ade80' },
    { label: 'Users', value: users.length, icon: '👥', color: '#f472b6' },
    { label: 'Roles', value: roles.length, icon: '🛡️', color: '#fbbf24' },
  ];

  // Role distribution chart (real-time)
  const roleCounts = roles.reduce((acc, r) => {
    acc[r.name] = users.filter(u => (u.roles || []).includes(r.id)).length;
    return acc;
  }, {});
  const roleDistData = {
    labels: roles.map(r => r.name),
    datasets: [{
      label: 'Roles',
      data: roles.map(r => roleCounts[r.name] || 0),
      backgroundColor: ['#fff2', '#bdbdbd', '#232323', '#f87171', '#60a5fa', '#a78bfa'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  // Tenant usage chart (real-time)
  const tenantUserCounts = tenants.map(t => users.filter(u => u.tenantId === t.id).length);
  const tenantUsageData = {
    labels: tenants.map(t => t.name),
    datasets: [{
      label: 'Active Users',
      data: tenantUserCounts,
      backgroundColor: ['#fff2', '#bdbdbd', '#232323', '#f87171', '#60a5fa', '#a78bfa'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  // Recent activity (real-time)
  const recentActivities = activityLogs.slice(-5).reverse();

  return (
    <div style={{
      padding: 32,
      background: 'var(--bg)',
      minHeight: '100vh',
      color: 'var(--text)',
      fontFamily: 'Inter, Playfair Display, JetBrains Mono, sans-serif',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100vw',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 12px 0',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4',
            background: 'none',
            WebkitTextFillColor: 'inherit',
            textTransform: 'capitalize',
          }}>
            {t(toTitleCase(canonicalRole) + ' Dashboard')} | Accessly
          </h1>
          <p style={{
            color: '#bdbdbd',
            fontSize: '18px',
            margin: 0,
            fontWeight: 400,
            letterSpacing: '0.3px',
            fontFamily: 'Inter, Playfair Display, serif',
            textTransform: 'capitalize',
          }}>
            {t('Welcome back, manage your workspace efficiently')}
          </p>
          <ul style={{ color: '#a8a8a8', fontSize: '15px', marginTop: 16, paddingLeft: 20 }}>
            {tips.map((tip, i) => <li key={i}>{t(tip)}</li>)}
          </ul>
        </div>
        <div style={{
          textAlign: 'right',
          color: '#e0e0e0',
          fontSize: '15px',
          background: 'rgba(30,30,30,0.85)',
          padding: '18px 24px',
          borderRadius: '20px',
          border: '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 16px #0006',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <div style={{ marginBottom: '8px', fontSize: '13px', textTransform: 'capitalize', letterSpacing: '1px', fontFamily: 'Inter, Playfair Display, serif' }}>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div style={{ 
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '22px',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 12px #fff2',
          }}>
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
        marginBottom: '48px',
        width: '100%'
      }}>
        {overview.map((card, index) => {
          const [isHovered, setIsHovered] = useState(false);
          
          return (
            <div 
              key={card.label}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ 
                background: isHovered
                  ? 'var(--input-bg)'
                  : 'var(--card)',
                borderRadius: '24px',
                border: `1.5px solid ${isHovered ? 'var(--input-bg)' : 'var(--card)'}`,
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                minHeight: '180px',
                boxShadow: isHovered ? '0 8px 32px #000a' : '0 2px 16px #0006',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={{ 
                fontSize: '38px', 
                marginBottom: '16px',
                filter: 'drop-shadow(0 2px 8px #fff2)',
                opacity: 0.92,
              }}>
                {card.icon}
              </span>
              <div style={{ 
                fontFamily: 'Playfair Display, serif', 
                fontSize: 'clamp(28px, 4vw, 40px)', 
                fontWeight: 700, 
                color: 'var(--text)', 
                marginBottom: '6px',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 16px #fff2',
              }}>
                {card.value}
              </div>
              <div style={{ 
                color: 'var(--text)', 
                fontSize: '17px', 
                fontWeight: 500,
                fontFamily: 'Inter, Playfair Display, serif',
                marginBottom: '8px',
              }}>
                {t(card.label)}
              </div>
              <div style={{ 
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '15px',
                color: card.color,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textShadow: '0 1px 8px #fff2',
              }}>
                {card.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '32px',
        marginBottom: '48px',
        width: '100%'
      }}>
        {/* Quick Access for System Admin */}
        {isAdmin && (
          <div style={{ 
            background: 'var(--card)',
            borderRadius: '24px',
            border: `1px solid var(--input-bg)`,
            padding: '36px',
            width: '100%',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '8px',
              position: 'relative',
            }}>
              {t('Quick Actions')}
            </div>
            <div style={{ 
              color: 'var(--text)',
              fontSize: '14px',
              marginBottom: '28px',
              position: 'relative',
            }}>
              {t('Manage your tenant\'s resources efficiently')}
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              width: '100%',
              position: 'relative',
            }}>
              {adminQuickActions.map(action => (
                <Button key={action.label} variant="outline" onClick={() => navigate(action.path)}>
                  <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  {t(action.label)}
                </Button>
              ))}
            </div>
          </div>
        )}
        {/* Quick Access for Tenant Admin */}
        {isTenantAdmin && (
          <div style={{ 
            background: 'var(--card)',
            borderRadius: '24px',
            border: `1px solid var(--input-bg)`,
            padding: '36px',
            width: '100%',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '8px',
              position: 'relative',
            }}>
              {t('Quick Actions')}
            </div>
            <div style={{ 
              color: 'var(--text)',
              fontSize: '14px',
              marginBottom: '28px',
              position: 'relative',
            }}>
              {t('Manage your tenant\'s resources efficiently')}
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              width: '100%',
              position: 'relative',
            }}>
              {tenantAdminQuickActions.map(action => (
                <Button key={action.label} variant="outline" onClick={() => navigate(action.path)}>
                  <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  {t(action.label)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Recent Activity */}
        <div style={{ 
          background: 'var(--card)',
          borderRadius: '24px',
          border: `1px solid var(--input-bg)`,
          padding: '36px',
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-30%',
            left: '-30%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          
          <div style={{ 
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '8px',
            position: 'relative',
          }}>
            {t('Recent Activity')}
          </div>
          
          <div style={{ 
            color: 'var(--text)',
            fontSize: '14px',
            marginBottom: '28px',
            position: 'relative',
          }}>
            {t('Latest updates and changes')}
          </div>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
          }}>
            {recentActivities.map((activity, index) => (
              <div key={index} style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'var(--input-bg)',
                border: `1px solid var(--input-bg)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}>
                <div style={{
                  color: 'var(--text)',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '6px',
                  lineHeight: 1.4,
                }}>
                  {activity.action}
                </div>
                <div style={{
                  color: 'var(--text)',
                  fontSize: '12px',
                  fontWeight: 400,
                  textTransform: 'capitalize',
                  letterSpacing: '0.5px',
                }}>
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced System Notifications */}
      <div style={{ 
        background: 'var(--card)',
        borderRadius: '24px',
        border: `1px solid var(--input-bg)`,
        padding: '36px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-40%',
          right: '-20%',
          width: '400px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        
        <div style={{ 
          fontFamily: 'Playfair Display, serif',
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '8px',
          position: 'relative',
        }}>
          {t('System Notifications')}
        </div>
        
        <div style={{ 
          color: 'var(--text)',
          fontSize: '14px',
          marginBottom: '28px',
          position: 'relative',
        }}>
          {t('Important alerts and system updates')}
        </div>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 24px',
            background: 'var(--input-bg)',
            borderRadius: '16px',
            border: `1px solid var(--input-bg)`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}>
            <div style={{
              fontSize: '20px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--input-bg)',
              borderRadius: '12px',
            }}>
              🔔
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                color: 'var(--text)',
                fontSize: '15px',
                fontWeight: 500,
                marginBottom: '4px',
              }}>
                {t('New user registration requires approval')}
              </div>
              <div style={{
                color: 'var(--text)',
                fontSize: '12px',
                textTransform: 'capitalize',
                letterSpacing: '0.5px',
              }}>
                {t('Action Required')}
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 24px',
            background: 'var(--input-bg)',
            borderRadius: '16px',
            border: `1px solid var(--input-bg)`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}>
            <div style={{
              fontSize: '20px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--input-bg)',
              borderRadius: '12px',
            }}>
              ⚠️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                color: 'var(--text)',
                fontSize: '15px',
                fontWeight: 500,
                marginBottom: '4px',
              }}>
                {t('Tenant Acme Corp subscription expiring soon')}
              </div>
              <div style={{
                color: 'var(--text)',
                fontSize: '12px',
                textTransform: 'capitalize',
                letterSpacing: '0.5px',
              }}>
                {t('Expires in 7 days')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--card)', borderRadius: 24, boxShadow: '0 8px 48px 0 #000a', padding: 32, flex: 1, minWidth: 320 }}>
          <h2 style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 16 }}>{t('User Activity')}</h2>
          {/* <Bar data={userActivityData} options={{ plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } } }} /> */}
        </div>
        <div style={{ background: 'var(--card)', borderRadius: 24, boxShadow: '0 8px 48px 0 #000a', padding: 32, flex: 1, minWidth: 320 }}>
          <h2 style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 16 }}>{t('Role Distribution')}</h2>
          <Pie data={roleDistData} options={{ plugins: { legend: { labels: { color: '#fff' } } } }} />
        </div>
        <div style={{ background: 'var(--card)', borderRadius: 24, boxShadow: '0 8px 48px 0 #000a', padding: 32, flex: 1, minWidth: 320 }}>
          <h2 style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 16 }}>{t('Tenant Usage')}</h2>
          <Line data={tenantUsageData} options={{ plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;