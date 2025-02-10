import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@KidsBookCreator:token';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      console.log('API: Token recuperado:', token);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API: Headers configurados com token');
      } else {
        console.log('API: Token não encontrado no AsyncStorage');
      }
      return config;
    } catch (error) {
      console.error('API: Erro ao configurar token:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('API: Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log(`API: Resposta bem-sucedida para ${response.config.url}`);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log('API: Erro 401 detectado - Token inválido ou expirado');
      try {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        delete api.defaults.headers.common['Authorization'];
        console.log('API: Token removido e headers limpos');
      } catch (storageError) {
        console.error('API: Erro ao remover token:', storageError);
      }
    }
    return Promise.reject(error);
  }
);