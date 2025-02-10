import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
      console.log('AuthService: Nova instância criada');
    }
    return AuthService.instance;
  }

  public getState(): AuthState {
    return {
      token: this.token,
      user: this.user
    };
  }

  async signIn({ email, password }: SignInCredentials): Promise<void> {
    console.log('AuthService: Iniciando login...', { email });
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('AuthService: Resposta do servidor:', response.data);
      
      const { token, user } = response.data;
      this.token = token;
      this.user = user;

      await AsyncStorage.setItem('@KidsBook:token', token);
      console.log('AuthService: Token armazenado com sucesso');
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('AuthService: Erro no login:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    console.log('AuthService: Iniciando logout...');
    try {
      this.token = null;
      this.user = null;
      await AsyncStorage.removeItem('@KidsBook:token');
      delete api.defaults.headers.common['Authorization'];
      console.log('AuthService: Logout realizado com sucesso');
    } catch (error) {
      console.error('AuthService: Erro no logout:', error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    console.log('AuthService: Verificando token...');
    try {
      const response = await api.post('/auth/verify', { token });
      console.log('AuthService: Token verificado:', response.data);
      return response.data.valid;
    } catch (error) {
      console.error('AuthService: Erro na verificação do token:', error);
      return false;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}