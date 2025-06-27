import { create } from 'zustand';
import apiService from '../services/apiService';

const useOrganizationStore = create((set, get) => ({
  organizations: [],
  loading: false,
  error: null,

  fetchOrganizations: async (tenantId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.get(`/api/v1/tenants/${tenantId}/organizations`);
      set({ organizations: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createOrganization: async (tenantId, organization) => {
    set({ loading: true, error: null });
    try {
      const newOrg = await apiService.post(`/api/v1/tenants/${tenantId}/organizations`, organization);
      set(state => ({ organizations: [...state.organizations, newOrg], loading: false }));
      return newOrg;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateOrganization: async (tenantId, id, organization) => {
    set({ loading: true, error: null });
    try {
      const updated = await apiService.put(`/api/v1/tenants/${tenantId}/organizations/${id}`, organization);
      set(state => ({
        organizations: state.organizations.map(o => o.id === id ? updated : o),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteOrganization: async (tenantId, id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/api/v1/tenants/${tenantId}/organizations/${id}`);
      set(state => ({ organizations: state.organizations.filter(o => o.id !== id), loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getOrganizationById: (id) => {
    return get().organizations.find(o => o.id === id);
  }
}));

export default useOrganizationStore; 