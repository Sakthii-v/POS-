import { api } from './api';
import type { User } from '../types/auth';
import { storage } from '../utils/storage';

// Enable mock auth by default unless VITE_USE_MOCK is explicitly 'false'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const MOCK_USER: User = {
  id: 'usr_admin_001',
  name: 'Tea Master Admin',
  email: 'admin@teapos.com',
  role: 'admin',
};

const MOCK_TOKEN = 'mock_jwt_token_for_tea_shop_pos_admin_123456789';

export const authService = {
  /**
   * Log in user using email and password
   */
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    if (USE_MOCK) {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email.trim().toLowerCase() === 'admin@teapos.com' && password === 'admin123') {
        // Store session tokens locally
        storage.set('auth_token', MOCK_TOKEN);
        storage.set('auth_user', MOCK_USER);
        return { user: MOCK_USER, token: MOCK_TOKEN };
      } else {
        throw {
          response: {
            status: 400,
            data: { message: 'Invalid email or password.' }
          },
          message: 'Invalid credentials'
        };
      }
    } else {
      const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
      storage.set('auth_token', response.data.token);
      storage.set('auth_user', response.data.user);
      return response.data;
    }
  },

  /**
   * Fetch current authenticated user profile
   */
  getCurrentUser: async (): Promise<User> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const token = storage.get<string>('auth_token');
      const user = storage.get<User>('auth_user');
      
      if (token === MOCK_TOKEN && user) {
        return user;
      }
      throw new Error('Unauthorized');
    } else {
      const response = await api.get<User>('/auth/me');
      return response.data;
    }
  },

  /**
   * Log out from server and clear all session storage
   */
  logout: async (): Promise<void> => {
    if (!USE_MOCK) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout API failed, forcing local session clear:', error);
      }
    }
    storage.remove('auth_token');
    storage.remove('auth_user');
  }
};
