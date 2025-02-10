import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@KidsBookCreator:token';

export const AuthService = {
  async signIn(email: string, password: string) {
    try {
      console.log('AuthService: Iniciando login...');
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      
      if (token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('AuthService: Token salvo com sucesso');
        return { success: true, token };
      }
      
      console.log('AuthService: Token não encontrado na resposta');
      return { success: false, error: 'Token não encontrado na resposta' };
    } catch (error) {
      console.error('AuthService: Erro no login:', error);
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

  async removeToken() {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      delete api.defaults.headers.common['Authorization'];
      console.log('AuthService: Token removido com sucesso');
    } catch (error) {
      console.error('AuthService: Erro ao remover token:', error);
    }
  },

  async verifyToken() {
    try {
      const token = await this.getToken();
      if (!token) {
        console.log('AuthService: Nenhum token encontrado');
        return false;
      }

      const response = await api.get('/auth/verify');
      console.log('AuthService: Token verificado com sucesso');
      return response.status === 200;
    } catch (error) {
      console.error('AuthService: Erro ao verificar token:', error);
      return false;
    }
  }
};