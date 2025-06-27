import { create } from 'zustand';
import apiService from '../services/apiService';
import { Button } from '@cred/neopop-web/lib/components';
import { motion } from 'framer-motion';

const useTenantStore = create((set, get) => ({
  tenants: [],
  loading: false,
  error: null,

  fetchTenants: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.get('/api/v1/tenants');
      set({ tenants: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createTenant: async (tenant) => {
    set({ loading: true, error: null });
    try {
      const newTenant = await apiService.post('/api/v1/tenants', tenant);
      set(state => ({ tenants: [...state.tenants, newTenant], loading: false }));
      return newTenant;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTenant: async (id, tenant) => {
    set({ loading: true, error: null });
    try {
      const updated = await apiService.put(`/api/v1/tenants/${id}`, tenant);
      set(state => ({
        tenants: state.tenants.map(t => t.id === id ? updated : t),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteTenant: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/api/v1/tenants/${id}`);
      set(state => ({ tenants: state.tenants.filter(t => t.id !== id), loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getTenantById: (id) => {
    return get().tenants.find(t => t.id === id);
  }
}));

export default useTenantStore; 