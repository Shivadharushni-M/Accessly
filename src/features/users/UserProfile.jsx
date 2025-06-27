import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { user, setError } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [activity, setActivity] = useState([]);
  const [notifications, setNotifications] = useState({});
  const [password, setPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [msg, setMsg] = useState('');
  const { t } = useTranslation();

  const cardStyle = {
    background: '#18181b',
    borderRadius: 24,
    boxShadow: '0 8px 48px 0 #000a',
    padding: 32,
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
    margin: '0 auto',
  };
  const sectionHeader = {
    fontFamily: 'Playfair Display, serif',
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 16,
    letterSpacing: '-0.02em',
  };
  const buttonStyle = {
    background: 'linear-gradient(135deg, #18181b 0%, #222 100%)',
    color: '#fff',
    border: '1.5px solid #333',
    borderRadius: 12,
    fontFamily: 'Inter, Playfair Display, serif',
    fontWeight: 600,
    fontSize: 18,
    padding: '12px 24px',
    cursor: 'pointer',
    boxShadow: '0 2px 12px #0008',
    transition: 'background 0.2s, box-shadow 0.2s',
    marginTop: 8,
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiService.get('/api/v1/me');
        reset(data);
        setProfile(data);
        apiService.get('/api/v1/me/activity').then(res => setActivity(Array.isArray(res) ? res : []));
        apiService.get('/api/v1/me/notifications').then(setNotifications);
      } catch (e) {
        setError(t('Failed to load profile'));
      }
    }
    fetchProfile();
  }, [reset, setError, t]);

  const onSubmit = async (data) => {
    try {
      await apiService.put('/api/v1/me', data);
      toast.success('Profile updated');
      reset(data);
      setProfile(data);
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };

  const handleEdit = () => {
    setForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      organization: profile.organization,
    });
    setEditing(true);
    setMsg('');
  };

  const handleSave = async () => {
    try {
      const res = await apiService.put('/api/v1/me', form);
      setMsg(res.message || 'Profile updated successfully');
      setEditing(false);
      setProfile({ ...profile, ...form });
      reset({ ...profile, ...form });
    } catch (error) {
      setMsg('Failed to update profile: ' + (error.message || 'Unknown error'));
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordChange = async () => {
    const res = await apiService.put('/api/v1/me/password', { password });
    setPasswordMsg(res.message);
    setPassword('');
  };

  const handleNotifChange = async (field) => {
    const newPrefs = { ...notifications, [field]: !notifications[field] };
    const res = await apiService.put('/api/v1/me/notifications', newPrefs);
    setNotifications(newPrefs);
    setNotifMsg('Preferences updated');
  };

  if (!profile) return <div>{t('Loading...')}</div>;

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
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 700,
        color: 'var(--text)',
        margin: 0,
        letterSpacing: '-0.03em',
        textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4',
        marginBottom: 32,
        textAlign: 'center',
      }}>{t('My Profile')}</h1>
      <div style={{
        background: 'var(--card)',
        borderRadius: 24,
        boxShadow: 'var(--shadow)',
        padding: 32,
        maxWidth: 520,
        margin: '0 auto'
      }}>
        <div style={sectionHeader}>{t('Profile Information')}</div>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('Name')} style={{ padding: 14, borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', border: '1.5px solid var(--border)', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }} />
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder={t('Email')} style={{ padding: 14, borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', border: '1.5px solid var(--border)', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }} />
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder={t('Phone')} style={{ padding: 14, borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', border: '1.5px solid var(--border)', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }} />
            <input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder={t('Organization')} style={{ padding: 14, borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', border: '1.5px solid var(--border)', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }} />
            <button onClick={handleSave} style={{ ...buttonStyle, background: '#4ade80', color: '#000' }}>{t('Save')}</button>
            <button onClick={() => setEditing(false)} style={buttonStyle}>{t('Cancel')}</button>
            {msg && <div style={{ color: '#4ade80' }}>{msg}</div>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><b>{t('Name')}:</b> {profile.name}</div>
            <div><b>{t('Email')}:</b> {profile.email}</div>
            <div><b>{t('Phone')}:</b> {profile.phone}</div>
            <div><b>{t('Organization')}:</b> {profile.organization}</div>
            <div><b>{t('Privileges:')}</b> {profile.privileges?.join(', ')}</div>
            <button onClick={handleEdit} style={{ ...buttonStyle, background: '#60a5fa', color: '#fff' }}>{t('Edit Profile')}</button>
          </div>
        )}
      </div>
      <div style={{
        background: 'var(--card)',
        borderRadius: 24,
        boxShadow: 'var(--shadow)',
        padding: 32,
        marginTop: 32,
        maxWidth: 520,
        margin: '0 auto'
      }}>
        <div style={sectionHeader}>{t('Change Password')}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('New Password')} style={{ padding: 14, borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', border: '1.5px solid var(--border)', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }} />
          <button onClick={handlePasswordChange} style={{ ...buttonStyle, background: '#fbbf24', color: '#000' }}>{t('Change')}</button>
        </div>
        {passwordMsg && <div style={{ color: '#fbbf24', marginTop: 8 }}>{passwordMsg}</div>}
      </div>
      <div style={{
        background: 'var(--card)',
        borderRadius: 24,
        boxShadow: 'var(--shadow)',
        padding: 32,
        marginTop: 32,
        maxWidth: 520,
        margin: '0 auto'
      }}>
        <div style={sectionHeader}>{t('Notification Preferences')}</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <label><input type="checkbox" checked={!!notifications.email} onChange={() => handleNotifChange('email')} /> {t('Email')}</label>
          <label><input type="checkbox" checked={!!notifications.sms} onChange={() => handleNotifChange('sms')} /> {t('SMS')}</label>
          <label><input type="checkbox" checked={!!notifications.push} onChange={() => handleNotifChange('push')} /> {t('Push')}</label>
        </div>
        {notifMsg && <div style={{ color: '#4ade80', marginTop: 8 }}>{notifMsg}</div>}
      </div>
      <div style={{
        background: 'var(--card)',
        borderRadius: 24,
        boxShadow: 'var(--shadow)',
        padding: 32,
        marginTop: 32,
        maxWidth: 520,
        margin: '0 auto'
      }}>
        <div style={sectionHeader}>{t('My Activity')}</div>
        <ul style={{ color: '#bdbdbd', fontSize: 15, margin: 0, padding: 0, listStyle: 'none' }}>
          {(Array.isArray(activity) ? activity : []).map(a => <li key={a.id} style={{ marginBottom: 8 }}>{a.action} <span style={{ color: '#888', fontSize: 13 }}>({a.time})</span></li>)}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile; 