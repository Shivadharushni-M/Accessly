import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const credColors = {
  black: '#000000',
  charcoal: '#1a1a1a',
  darkGrey: '#2a2a2a',
  mediumGrey: '#666666',
  lightGrey: '#a8a8a8',
  white: '#ffffff',
  borderGrey: '#333333',
  inputBg: '#111111',
};

const ROLE_OPTIONS = [
  'System Administrator',
  'Tenant Administrator',
  'User',
];

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();
  const { registerUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ ...data, role: selectedRole });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      if (error && error.message) {
        if (error.message.includes('Password')) {
          setError('password', { type: 'manual', message: error.message });
        } else if (error.message.includes('Email')) {
          setError('email', { type: 'manual', message: error.message });
        } else if (error.message.includes('Username')) {
          setError('username', { type: 'manual', message: error.message });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '18px 24px',
    borderRadius: '10px',
    border: `1.5px solid ${focusedField === fieldName ? credColors.white : credColors.borderGrey}`,
    background: credColors.inputBg,
    color: credColors.white,
    fontSize: '15px',
    fontWeight: '400',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: '"Montserrat", sans-serif',
    letterSpacing: '0.3px',
    boxSizing: 'border-box',
  });

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: credColors.black,
      fontFamily: '"Montserrat", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      padding: '20px',
      margin: 0,
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700&family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet" />
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: credColors.charcoal,
        borderRadius: '16px',
        border: `1px solid ${credColors.borderGrey}`,
        padding: '48px 40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'Playfair Display, Crimson Text, serif',
            fontSize: '48px',
            fontWeight: 800,
            color: credColors.white,
            letterSpacing: '-2px',
            marginBottom: '8px',
            textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4',
            textAlign: 'center',
            userSelect: 'none',
          }}>
            Accessly
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: credColors.white,
            margin: '0 0 16px 0',
            letterSpacing: '-1.2px',
            fontFamily: '"Playfair Display", "Crimson Text", serif',
            textAlign: 'center',
          }}>
            {t('Create account')}
          </h1>
          <p style={{
            fontSize: '16px',
            color: credColors.lightGrey,
            margin: 0,
            fontWeight: '400',
            letterSpacing: '0.2px',
            fontFamily: '"Montserrat", sans-serif',
            textAlign: 'center',
          }}>
            {t('Get started in seconds')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Username Field */}
          <div>
            <input
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
              })}
              placeholder={t('Username')}
              autoComplete="username"
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              style={{
                ...inputStyle('username'),
                '::placeholder': { color: credColors.mediumGrey }
              }}
            />
            {errors.username && (
              <div style={{ 
                color: '#ff4444', 
                fontSize: '14px', 
                marginTop: '8px',
                fontWeight: '400' 
              }}>
                {errors.username.message}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                }
              })}
              placeholder={t('Email address')}
              autoComplete="email"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              style={{
                ...inputStyle('email'),
                '::placeholder': { color: credColors.mediumGrey }
              }}
            />
            {errors.email && (
              <div style={{ 
                color: '#ff4444', 
                fontSize: '14px', 
                marginTop: '8px',
                fontWeight: '400' 
              }}>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              placeholder={t('Password')}
              autoComplete="new-password"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              style={{
                ...inputStyle('password'),
                '::placeholder': { color: credColors.mediumGrey }
              }}
            />
            {errors.password && (
              <div style={{ 
                color: '#ff4444', 
                fontSize: '14px', 
                marginTop: '8px',
                fontWeight: '400' 
              }}>
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: '8px', textAlign: 'center' }}>
            <label style={{ color: credColors.lightGrey, fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>{t('Register as')}</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: `1.5px solid ${credColors.borderGrey}`,
                background: credColors.charcoal,
                color: credColors.white,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 500,
                fontSize: '15px',
                letterSpacing: '0.2px',
                cursor: 'pointer',
                outline: 'none',
                width: '100%',
                margin: '0 auto 12px auto',
                maxWidth: 320
              }}
            >
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '16px',
              background: credColors.white,
              color: credColors.black,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = credColors.lightGrey;
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                e.currentTarget.style.background = credColors.white;
              }
            }}
          >
            {loading ? t('Creating account...') : t('Create account')}
          </button>
        </form>

        {/* Terms */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{
            fontSize: '12px',
            color: credColors.mediumGrey,
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            {t('By creating an account, you agree to our')}
            <span style={{ color: credColors.white }}>{t('Terms of Service')}</span> and{' '}
            <span style={{ color: credColors.white }}>{t('Privacy Policy')}</span>
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: `1px solid ${credColors.borderGrey}`
        }}>
          <p style={{
            fontSize: '14px',
            color: credColors.lightGrey,
            margin: 0
          }}>
            {t('Already have an account?')}
            <a 
              href="/login" 
              style={{
                color: credColors.white,
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: `1px solid ${credColors.white}`,
                paddingBottom: '1px'
              }}
            >
              {t('Sign in')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;