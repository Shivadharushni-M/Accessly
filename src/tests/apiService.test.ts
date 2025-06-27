import { describe, it, expect, vi } from 'vitest';
import ApiService from '../services/apiService';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('ApiService', () => {
  describe('Login', () => {
    it('should successfully login and store tokens', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          user: { id: '1', username: 'testuser' }
        }
      };

      // @ts-ignore
      axios.post.mockResolvedValue(mockResponse);

      const result = await ApiService.login({
        username: 'testuser',
        password: 'password'
      });

      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('access_token')).toBe('mock_access_token');
      expect(localStorage.getItem('refresh_token')).toBe('mock_refresh_token');
    });

    it('should handle login failure', async () => {
      // @ts-ignore
      axios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      });

      await expect(
        ApiService.login({
          username: 'invalid',
          password: 'invalid'
        })
      ).rejects.toThrow();
    });
  });

  // Add more test cases for other methods
});