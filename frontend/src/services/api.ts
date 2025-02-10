import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@KidsBookCreator:token');
    console.log('Token recuperado:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Headers configurados:', config.headers);
    } else {
      console.log('Token não encontrado no AsyncStorage');
    }
    return config;
  } catch (error) {
    console.error('Erro ao configurar token:', error);
    return Promise.reject(error);
  }
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Erro 401 detectado - Token inválido ou expirado');
      try {
        await AsyncStorage.removeItem('@KidsBookCreator:token');
        console.log('Token removido do AsyncStorage');
      } catch (storageError) {
        console.error('Erro ao remover token:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;