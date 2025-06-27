import { create } from 'zustand';
import apiService from '../services/apiService';

const usePrivilegeStore = create((set, get) => ({
  privileges: [],
  loading: false,
  error: null,

  fetchPrivileges: async (tenantId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.get(`/api/v1/tenants/${tenantId}/privileges`);
      set({ privileges: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createPrivilege: async (tenantId, privilege) => {
    set({ loading: true, error: null });
    try {
      const newPrivilege = await apiService.post(`/api/v1/tenants/${tenantId}/privileges`, privilege);
      set(state => ({ privileges: [...state.privileges, newPrivilege], loading: false }));
      return newPrivilege;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePrivilege: async (tenantId, id, privilege) => {
    set({ loading: true, error: null });
    try {
      const updated = await apiService.put(`/api/v1/tenants/${tenantId}/privileges/${id}`, privilege);
      set(state => ({
        privileges: state.privileges.map(p => p.id === id ? updated : p),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePrivilege: async (tenantId, id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/api/v1/tenants/${tenantId}/privileges/${id}`);
      set(state => ({ privileges: state.privileges.filter(p => p.id !== id), loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getPrivilegeById: (id) => {
    return get().privileges.find(p => p.id === id);
  }
}));

export default usePrivilegeStore; 