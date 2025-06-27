import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const TenantSettings = ({ tenantId, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await apiService.get(`/api/v1/tenants/${tenantId}/settings`);
        reset(data);
      } catch (e) {
        toast.error('Failed to load settings');
      }
    }
    fetchSettings();
  }, [tenantId, reset]);

  const onSubmit = async (data) => {
    try {
      await apiService.put(`/api/v1/tenants/${tenantId}/settings`, data);
      toast.success('Settings updated');
      reset(data);
      onClose && onClose();
    } catch (e) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Domain</label>
        <input {...register('domain', { required: 'Domain required' })}
          style={{ width: '100%', padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', border: errors.domain ? '1.5px solid #f87171' : '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', marginBottom: 4 }}
        />
        {errors.domain && <div style={{ color: '#f87171', fontSize: 14 }}>{errors.domain.message}</div>}
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Contact Email</label>
        <input {...register('email', { required: 'Contact email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
          style={{ width: '100%', padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', border: errors.email ? '1.5px solid #f87171' : '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', marginBottom: 4 }}
        />
        {errors.email && <div style={{ color: '#f87171', fontSize: 14 }}>{errors.email.message}</div>}
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Theme</label>
        <select {...register('theme', { required: 'Theme required' })}
          style={{ width: '100%', padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', border: errors.theme ? '1.5px solid #f87171' : '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', marginBottom: 4 }}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        {errors.theme && <div style={{ color: '#f87171', fontSize: 14 }}>{errors.theme.message}</div>}
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ background: '#232323', color: '#fff', border: '1.5px solid #333', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: 'pointer', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s' }}>Cancel</button>
        <button type="submit" disabled={!isDirty || isSubmitting} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: isDirty && !isSubmitting ? 'pointer' : 'not-allowed', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s', opacity: isDirty && !isSubmitting ? 1 : 0.6 }}>{isSubmitting ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
};

export default TenantSettings; 