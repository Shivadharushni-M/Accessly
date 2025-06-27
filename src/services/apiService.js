import axios from 'axios';
import { toast } from 'react-toastify';

class ApiService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
    this.axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await this.refreshToken(refreshToken);
            localStorage.setItem('access_token', response.accessToken);
            localStorage.setItem('refresh_token', response.refreshToken);
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, config) {
    try {
      const response = await this.axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post(url, data, config) {
    if (url === '/api/v1/auth/refresh') {
      // Simulate token refresh
      return {
        token: 'fake_jwt_token',
        expiresIn: 60 // seconds
      };
    }
    if (url === '/api/v1/auth/login' || url === '/api/v1/auth/register') {
      // Use fetch for MSW mock API
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await response.json();
      if (!response.ok) {
        const error = new Error(json.message || 'API error');
        error.status = response.status;
        error.message = json.message;
        throw error;
      }
      return json;
    }
    try {
      const response = await this.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put(url, data, config) {
    try {
      const response = await this.axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete(url, config) {
    try {
      const response = await this.axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  handleError(error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'An unexpected error occurred';
      switch (status) {
        case 400:
          toast.error('Bad Request: ' + message);
          break;
        case 401:
          toast.error('Unauthorized. Please log in again.');
          this.logout();
          break;
        case 403:
          toast.error('Forbidden: You do not have permission.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          if (error.response?.data?.errors) {
            Object.values(error.response.data.errors).forEach((errorMessages) => {
              errorMessages.forEach((msg) => toast.error(msg));
            });
          }
          break;
        case 500:
          toast.error('Internal Server Error. Please try again later.');
          break;
        default:
          toast.error(message);
      }
    } else {
      toast.error('Network Error. Please check your connection.');
    }
  }

  async login(credentials) {
    const response = await this.post('/api/v1/auth/login', credentials);
    localStorage.setItem('access_token', response.token);
    // No refresh token in mock, but keep for real API
    return response;
  }

  async refreshToken() {
    // Simulate a real refresh call
    const response = await this.post('/api/v1/auth/refresh');
    localStorage.setItem('access_token', response.token);
    return response.token;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
}

export default new ApiService();