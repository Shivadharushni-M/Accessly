import { create } from 'zustand';
import apiService from '../services/apiService';

const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (tenantId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.get(`/api/v1/tenants/${tenantId}/users`);
      set({ users: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createUser: async (tenantId, user) => {
    set({ loading: true, error: null });
    try {
      const newUser = await apiService.post(`/api/v1/tenants/${tenantId}/users`, user);
      set(state => ({ users: [...state.users, newUser], loading: false }));
      return newUser;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateUser: async (tenantId, id, user) => {
    set({ loading: true, error: null });
    try {
      const updated = await apiService.put(`/api/v1/tenants/${tenantId}/users/${id}`, user);
      set(state => ({
        users: state.users.map(u => u.id === id ? updated : u),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteUser: async (tenantId, id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/api/v1/tenants/${tenantId}/users/${id}`);
      set(state => ({ users: state.users.filter(u => u.id !== id), loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getUserById: (id) => {
    return get().users.find(u => u.id === id);
  }
}));

export default useUserStore; 