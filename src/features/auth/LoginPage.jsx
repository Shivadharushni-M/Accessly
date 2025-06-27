import React, { useState, useEffect } from 'react';
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

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const { t } = useTranslation();
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    clearError();
    reset();
    setTimeout(() => {
      const username = document.querySelector('input[name="username"]')?.value;
      const password = document.querySelector('input[name="password"]')?.value;
      if (username) setValue('username', username);
      if (password) setValue('password', password);
    }, 500);
  }, []);

  useEffect(() => {
    // Listen for autofill and trigger validation
    const interval = setInterval(() => {
      const username = document.querySelector('input[name="username"]')?.value;
      const password = document.querySelector('input[name="password"]')?.value;
      if (username) setValue('username', username, { shouldValidate: true });
      if (password) setValue('password', password, { shouldValidate: true });
    }, 300);
    return () => clearInterval(interval);
  }, [setValue]);

  const handleInputChange = () => {
    clearError();
  };

  const onSubmit = async (data) => {
    setLoginError('');
    setLoading(true);
    try {
      await login({ ...data, rememberMe }, navigate);
      clearError();
      toast.success('Login successful!');
      reset();
    } catch (e) {
      setLoginError(t('Invalid credentials'));
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
            {t('Welcome back')}
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
            {t('Sign in to continue')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Username Field */}
          <div>
            <input
              {...register('username', { required: 'Username or Email is required' })}
              placeholder={t('Username or Email')}
              autoComplete="username"
              defaultValue={''}
              onChange={handleInputChange}
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

          {/* Password Field */}
          <div>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder={t('Password')}
              autoComplete="current-password"
              defaultValue={''}
              onChange={handleInputChange}
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

          {/* Error Message */}
          {loginError && (
            <div style={{ 
              color: '#ff4444', 
              fontSize: '14px', 
              textAlign: 'center',
              fontWeight: '400',
              background: 'rgba(255, 68, 68, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 68, 68, 0.2)'
            }}>
              {loginError}
            </div>
          )}

          {/* Remember Me */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px'
          }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: credColors.white,
                cursor: 'pointer'
              }}
            />
            <label 
              htmlFor="rememberMe" 
              style={{ 
                fontSize: '14px', 
                color: credColors.lightGrey,
                fontWeight: '400',
                cursor: 'pointer',
                fontFamily: '"Montserrat", sans-serif',
                letterSpacing: '0.2px',
              }}
            >
              {t('Remember me')}
            </label>
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
            {loading ? t('Signing in...') : t('Sign in')}
          </button>
        </form>

        {/* Footer */}
        <div style={{ 
          marginTop: '32px', 
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: `1px solid ${credColors.borderGrey}`
        }}>
          <p style={{
            fontSize: '14px',
            color: credColors.lightGrey,
            margin: 0
          }}>
            {t('Don\'t have an account?')} {' '}
            <a 
              href="/register" 
              style={{
                color: credColors.white,
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: `1px solid ${credColors.white}`,
                paddingBottom: '1px'
              }}
            >
              {t('Sign up')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};