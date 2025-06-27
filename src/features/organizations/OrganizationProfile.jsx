import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const OrganizationProfile = ({ tenantId, orgId, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiService.get(`/api/v1/tenants/${tenantId}/organizations/${orgId}/profile`);
        reset(data);
      } catch (e) {
        toast.error('Failed to load organization profile');
      }
    }
    fetchProfile();
  }, [tenantId, orgId, reset]);

  const onSubmit = async (data) => {
    try {
      await apiService.put(`/api/v1/tenants/${tenantId}/organizations/${orgId}/profile`, data);
      toast.success('Profile updated');
      reset(data);
      onClose && onClose();
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Organization Name</label>
        <input {...register('name', { required: 'Name required' })}
          style={{ width: '100%', padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', border: errors.name ? '1.5px solid #f87171' : '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', marginBottom: 4 }}
        />
        {errors.name && <div style={{ color: '#f87171', fontSize: 14 }}>{errors.name.message}</div>}
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>Description</label>
        <textarea {...register('description')}
          style={{ width: '100%', padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', border: '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', marginBottom: 4, minHeight: 80 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ background: '#232323', color: '#fff', border: '1.5px solid #333', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: 'pointer', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s' }}>Cancel</button>
        <button type="submit" disabled={!isDirty || isSubmitting} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: isDirty && !isSubmitting ? 'pointer' : 'not-allowed', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s', opacity: isDirty && !isSubmitting ? 1 : 0.6 }}>{isSubmitting ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
};

export default OrganizationProfile; 