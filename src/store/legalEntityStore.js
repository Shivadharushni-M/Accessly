import { create } from 'zustand';
import apiService from '../services/apiService';

const useLegalEntityStore = create((set, get) => ({
  legalEntities: [],
  loading: false,
  error: null,

  fetchLegalEntities: async (tenantId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.get(`/api/v1/tenants/${tenantId}/legal-entities`);
      set({ legalEntities: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createLegalEntity: async (tenantId, entity) => {
    set({ loading: true, error: null });
    try {
      const newEntity = await apiService.post(`/api/v1/tenants/${tenantId}/legal-entities`, entity);
      set(state => ({ legalEntities: [...state.legalEntities, newEntity], loading: false }));
      return newEntity;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateLegalEntity: async (tenantId, id, entity) => {
    set({ loading: true, error: null });
    try {
      const updated = await apiService.put(`/api/v1/tenants/${tenantId}/legal-entities/${id}`, entity);
      set(state => ({
        legalEntities: state.legalEntities.map(e => e.id === id ? updated : e),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteLegalEntity: async (tenantId, id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/api/v1/tenants/${tenantId}/legal-entities/${id}`);
      set(state => ({ legalEntities: state.legalEntities.filter(e => e.id !== id), loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getLegalEntityById: (id) => {
    return get().legalEntities.find(e => e.id === id);
  }
}));

export default useLegalEntityStore; 