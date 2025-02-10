import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const AUTH_TOKEN_KEY = '@KidsBookCreator:token';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: 'parent' | 'child';
}

export const AuthService = {
  async register(data: RegisterData) {
    try {
      console.log('AuthService: Iniciando registro');
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('AuthService: Erro no registro:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      console.log('AuthService: Iniciando login');
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;

      if (token) {
        console.log('AuthService: Token recebido, salvando...');
        await this.setToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('AuthService: Erro no login:', error);
      throw error;
    }
  },

  async logout() {
    try {
      console.log('AuthService: Iniciando logout');
      await this.removeToken();
      return true;
    } catch (error) {
      console.error('AuthService: Erro no logout:', error);
      throw error;
    }
  },

  async getToken() {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      console.log('AuthService: Token recuperado:', token);
      return token;
    } catch (error) {
      console.error('AuthService: Erro ao recuperar token:', error);
      return null;
    }
  },

  async setToken(token: string) {
    try {
      console.log('AuthService: Salvando token');
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('AuthService: Token salvo e configurado no Axios');
    } catch (error) {
      console.error('AuthService: Erro ao salvar token:', error);
      throw error;
    }
  },

  async removeToken() {
    try {
      console.log('AuthService: Removendo token');
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      delete api.defaults.headers.common['Authorization'];
      console.log('AuthService: Token removido');
    } catch (error) {
      console.error('AuthService: Erro ao remover token:', error);
      throw error;
    }
  },

  async verifyToken() {
    try {
      console.log('AuthService: Verificando token');
      const token = await this.getToken();
      
      if (!token) {
        console.log('AuthService: Token não encontrado');
        return false;
      }

      const response = await api.get('/auth/verify');
      console.log('AuthService: Token verificado com sucesso');
      return response.status === 200;
    } catch (error) {
      console.error('AuthService: Erro ao verificar token:', error);
      await this.removeToken();
      return false;
    }
  }
};