export { api } from './api/axiosConfig';

// Configure interceptors
import { api } from './api/axiosConfig';

api.interceptors.response.use(
  (response) => {
    console.log(`API: Success response from ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log('API: 401 error detected - Invalid or expired token');
      // Instead of directly calling AuthService, we'll emit an event that AuthContext will handle
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);