// frontend/src/services/config/axios-interceptors.ts
import { AxiosInstance, AxiosError } from 'axios';
import { authState } from '../auth/AuthState';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      console.log('Request Interceptor: Processing request...');
      const token = authState.getToken();

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
    async (error: AxiosError) => {
      const originalRequest = error.config;
      console.error('Response Interceptor: Error:', error?.response?.status);
      
      if (error?.response?.status === 401) {
        if (originalRequest?.url?.includes('/auth/refresh')) {
          console.log('Response Interceptor: Refresh token failed, signing out...');
          await authState.clearState();
          processQueue(error);
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        }

        isRefreshing = true;
        console.log('Response Interceptor: Attempting to refresh token...');

        try {
          const response = await axiosInstance.post('/auth/refresh');
          const { token, user } = response.data;
          
          await authState.updateState(token, user);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          processQueue(null);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.log('Response Interceptor: Token refresh failed, signing out...');
          await authState.clearState();
          processQueue(refreshError as Error);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      return Promise.reject(error);
    }
  );
};