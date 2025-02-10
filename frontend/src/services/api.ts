import axios from 'axios';
import { AuthService } from './auth/AuthService';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for authentication errors
api.interceptors.response.use(
  (response) => {
    console.log(`API: Success response from ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log('API: 401 error detected - Invalid or expired token');
      const authService = AuthService.getInstance();
      await authService.signOut();
    }
    return Promise.reject(error);
  }
);