import { create } from 'zustand';
import apiService from '../services/apiService';

const useRoleStore = create((set, get) => ({
  roles: [],
  loading: false,
  error: null,

  fetchRoles: async (tenantId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.get(`/api/v1/tenants/${tenantId}/roles`);
      set({ roles: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createRole: async (tenantId, role) => {
    set({ loading: true, error: null });
    try {
      const newRole = await apiService.post(`/api/v1/tenants/${tenantId}/roles`, role);
      set(state => ({ roles: [...state.roles, newRole], loading: false }));
      return newRole;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateRole: async (tenantId, id, role) => {
    set({ loading: true, error: null });
    try {
      const updated = await apiService.put(`/api/v1/tenants/${tenantId}/roles/${id}`, role);
      set(state => ({
        roles: state.roles.map(r => r.id === id ? updated : r),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteRole: async (tenantId, id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/api/v1/tenants/${tenantId}/roles/${id}`);
      set(state => ({ roles: state.roles.filter(r => r.id !== id), loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getRoleById: (id) => {
    return get().roles.find(r => r.id === id);
  }
}));

export default useRoleStore; 