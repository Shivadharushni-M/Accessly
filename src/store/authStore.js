import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiService from '../services/apiService';

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour for demo

const rehydrateAuth = (set, get) => {
  set({ showLogoutDialog: false });
  let token = localStorage.getItem('token') || sessionStorage.getItem('token');
  let tokenExpiry = localStorage.getItem('tokenExpiry') || sessionStorage.getItem('tokenExpiry');
  if (token && tokenExpiry) {
    if (Date.now() > Number(tokenExpiry)) {
      set({ user: null, token: null, isAuthenticated: false, tokenExpiry: null, showLogoutDialog: false });
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('tokenExpiry');
    } else {
      set({ token, isAuthenticated: true, tokenExpiry: Number(tokenExpiry), showLogoutDialog: false });
      get().setupAutoLogout();
    }
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      tokenExpiry: null,
      showLogoutDialog: false,
      role: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      login: async (credentials, navigate) => {
        set({ loading: true, error: null });
        try {
          console.log('Attempting login with credentials:', { username: credentials.username, rememberMe: credentials.rememberMe });
          const response = await apiService.post('/api/v1/auth/login', credentials);
          console.log('Login API response:', response); // Debug log

          // Check if response indicates an error (even if HTTP status is 200)
          if (response.message && (response.message.includes('not registered') || response.message.includes('Invalid credentials'))) {
            let errorMsg = response.message.includes('not registered') ? 'Email not registered' : 'Invalid credentials';
            set({ user: null, token: null, isAuthenticated: false, loading: false, error: errorMsg, role: null });
            throw new Error(errorMsg);
          }

          // Check if we have the required fields for a successful login
          if (!response.token || !response.user) {
            console.error('Invalid response structure:', response);
            set({ user: null, token: null, isAuthenticated: false, loading: false, error: 'Invalid server response', role: null });
            throw new Error('Invalid server response');
          }

          const expiry = Date.now() + TOKEN_EXPIRY_MS;
          const userRole = response.user?.role === 'SYSTEM_ADMIN' ? 'ADMINISTRATOR' : response.user?.role || null;

          console.log('Login response user:', response.user);
          console.log('Mapped user role:', userRole);
          console.log('Original role from response:', response.user?.role);

          set({
            user: { ...response.user, role: userRole },
            token: response.token,
            isAuthenticated: true,
            loading: false,
            tokenExpiry: expiry,
            role: userRole,
            error: null // Clear error on success
          });

          // Set RBAC permissions for admin
          if (userRole === 'ADMINISTRATOR') {
            try {
              const { setPermissions } = require('../store/rbacStore').default.getState();
              const { ROLE_PERMISSIONS } = require('../config/permissions');
              setPermissions(
                ROLE_PERMISSIONS['ADMINISTRATOR'].reduce((acc, p) => {
                  const [resource, action] = p.split(':');
                  if (!acc[resource]) acc[resource] = [];
                  acc[resource].push(action);
                  return acc;
                }, {})
              );
            } catch (rbacError) {
              console.warn('RBAC setup failed:', rbacError);
              // Don't fail login if RBAC setup fails
            }
          }

          // Store tokens
          if (credentials.rememberMe) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('tokenExpiry', expiry);
          } else {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('tokenExpiry', expiry);
          }

          get().setupAutoLogout();

          if (navigate) navigate('/dashboard', { replace: true });

          console.log('Login successful, user:', response.user);
          return response;

        } catch (error) {
          console.error('Login error:', error);

          // If it's already our custom error, don't change the message
          if (error.message === 'Email not registered' || error.message === 'Invalid credentials' || error.message === 'Invalid server response') {
            // Error is already set in the state above
            throw error;
          }

          // Handle other types of errors (network, parsing, etc.)
          let errorMsg = 'Login failed. Please try again.';

          // Check if it's a network error or API error
          if (error.response) {
            // API returned an error response
            const data = error.response.data || error.response;
            if (data.message) {
              if (data.message.includes('not registered')) {
            errorMsg = 'Email not registered';
              } else if (data.message.includes('credentials') || data.message.includes('password')) {
                errorMsg = 'Invalid credentials';
              } else {
                errorMsg = data.message;
              }
            }
          } else if (error.message) {
            // Other errors (network, parsing, etc.)
            errorMsg = error.message;
          }

          set({ user: null, token: null, isAuthenticated: false, loading: false, error: errorMsg, role: null });
          throw error;
        }
      },

      registerUser: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/api/v1/auth/register', data);
          // Do not auto-login after registration, just return response
          set({ loading: false });
          return response;
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false, loading: false, error: 'Registration failed' });
          throw error;
        }
      },

      setupAutoLogout: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return;
        const timeout = tokenExpiry - Date.now();
        if (timeout > 0) {
          setTimeout(() => {
            get().logout();
            alert('Session expired. You have been logged out.');
          }, timeout);
        }
      },

      refreshToken: async () => {
        // Call the mock refresh endpoint
        try {
          const response = await apiService.post('/api/v1/auth/refresh');
          const newExpiry = Date.now() + response.expiresIn * 1000;
          set({ token: response.token, tokenExpiry: newExpiry });
          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenExpiry', newExpiry);
          get().setupAutoLogout();
          return response.token;
        } catch (e) {
          get().logout();
          throw e;
        }
      },

      logout: () => {
        console.debug('[AUTH] logout() called, setting showLogoutDialog: true');
        set({ showLogoutDialog: true });
      },

      confirmLogout: () => {
        set({ user: null, token: null, isAuthenticated: false, tokenExpiry: null, showLogoutDialog: false });
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiry');
        window.location.href = '/login';
      },

      cancelLogout: () => {
        set({ showLogoutDialog: false });
      },

      getRole: () => get().user?.role || null,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        rehydrateAuth(state.setState, state.getState);
      },
      partialize: (state) => {
        // Do not persist the error field or showLogoutDialog
        const { error, showLogoutDialog, ...rest } = state;
        return rest;
      }
    }
  )
);

export default useAuthStore;