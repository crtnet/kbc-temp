// frontend/src/services/config/axios-interceptors.ts
import { AxiosInstance } from 'axios';
import { AuthService } from '../auth/AuthService';

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      console.log('Request Interceptor: Processing request...');
      const authService = await AuthService.getInstance();
      const token = authService.getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Request Interceptor: Token added to request');
      } else {
        console.log('Request Interceptor: No token available');
      }

      return config;
    },
    (error) => {
      console.error('Request Interceptor: Error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Response Interceptor: Successfully received response');
      return response;
    },
    async (error) => {
      console.error('Response Interceptor: Error:', error?.response?.status);
      
      if (error?.response?.status === 401) {
        console.log('Response Interceptor: Unauthorized, signing out...');
        const authService = await AuthService.getInstance();
        await authService.signOut();
      }
      
      return Promise.reject(error);
    }
  );
};