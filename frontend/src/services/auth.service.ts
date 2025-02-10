import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@KidsBookCreator:token';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export class AuthService {
  private static instance: AuthService;
  private state: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false
  };

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
  }
  async signIn(email: string, password: string) {
    try {
      console.log('AuthService: Iniciando login...', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('AuthService: Resposta do servidor recebida');

      const { token, user } = response.data;
      
      if (token && user) {
        await this.setToken(token);
        this.setState({
          token,
          user,
          isAuthenticated: true
        });
        console.log('AuthService: Login realizado com sucesso');
        return { success: true, token, user };
      }
      
      console.log('AuthService: Token ou usuário não encontrado na resposta');
      return { success: false, error: 'Dados de autenticação incompletos' };
    } catch (error) {
      console.error('AuthService: Erro no login:', error);
      throw error;
    }
  }

  async setToken(token: string) {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.setState({ token });
      console.log('AuthService: Token configurado nos headers e estado atualizado');
    } catch (error) {
      console.error('AuthService: Erro ao salvar token:', error);
      throw error;
    }
  }

  async getToken() {
    try {
      if (this.state.token) {
        return this.state.token;
      }

      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.setState({ token });
        console.log('AuthService: Token recuperado do storage e configurado');
      }
      return token;
    } catch (error) {
      console.error('AuthService: Erro ao recuperar token:', error);
      return null;
    }
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      delete api.defaults.headers.common['Authorization'];
      this.setState({
        token: null,
        user: null,
        isAuthenticated: false
      });
      console.log('AuthService: Token removido e estado limpo');
    } catch (error) {
      console.error('AuthService: Erro ao remover token:', error);
      throw error;
    }
  }

  async verifyToken() {
    try {
      const token = await this.getToken();
      if (!token) {
        console.log('AuthService: Nenhum token encontrado');
        return false;
      }

      const response = await api.get('/auth/verify');
      const isValid = response.status === 200;
      
      if (isValid) {
        const { user } = response.data;
        this.setState({
          isAuthenticated: true,
          user
        });
        console.log('AuthService: Token verificado com sucesso');
      } else {
        await this.removeToken();
        console.log('AuthService: Token inválido removido');
      }

      return isValid;
    } catch (error) {
      console.error('AuthService: Erro ao verificar token:', error);
      await this.removeToken();
      return false;
    }
  }

  async signOut() {
    try {
      await this.removeToken();
      console.log('AuthService: Logout realizado com sucesso');
    } catch (error) {
      console.error('AuthService: Erro ao fazer logout:', error);
      throw error;
    }
  }
};