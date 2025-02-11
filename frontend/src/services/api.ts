// frontend/src/services/api.ts
import { axiosInstance } from './config/axios';
import { AuthService } from './auth/AuthService';

const api = axiosInstance;

api.interceptors.request.use(async (config) => {
  try {
    const authService = await AuthService.getInstance();
    const token = authService.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  } catch (error) {
    console.error('API interceptor error:', error);
    return config;
  }
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const authService = await AuthService.getInstance();
        await authService.signOut();
      } catch (signOutError) {
        console.error('Error during sign out:', signOutError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;