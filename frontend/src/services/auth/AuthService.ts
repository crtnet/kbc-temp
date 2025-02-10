import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, configureAxiosToken } from '../api/axiosConfig';
import { AUTH_STORAGE_KEYS, API_ROUTES } from './constants';
import type { AuthResponse, LoginCredentials, AuthState, User } from './types';

class AuthService {
  private static instance: AuthService | null = null;
  private static initializationPromise: Promise<AuthService> | null = null;
  private token: string | null = null;
  private user: User | null = null;
  private initialized = false;

  private constructor() {}

  public static async getInstance(): Promise<AuthService> {
    if (!AuthService.instance) {
      if (!AuthService.initializationPromise) {
        AuthService.initializationPromise = new Promise(async (resolve) => {
          const service = new AuthService();
          await service.initialize();
          AuthService.instance = service;
          resolve(service);
        });
      }
      await AuthService.initializationPromise;
    }
    return AuthService.instance!;
  }

  private async initialize(): Promise<void> {
    try {
      console.log('AuthService: Initializing...');
      const storedToken = await AsyncStorage.getItem('@KidsBook:token');
      if (storedToken) {
        this.token = storedToken;
        // Verificar se o token é válido
        try {
          const response = await api.get('/auth/verify');
          this.user = response.data.user;
        } catch (error) {
          console.log('AuthService: Token inválido, limpando...');
          await this.signOut();
        }
      }
      this.initialized = true;
      console.log('AuthService: Initialized successfully');
    } catch (error) {
      console.error('AuthService: Initialization error:', error);
      this.initialized = false;
      throw error;
    }
  }

  private configureAxiosToken(token: string | null) {
    configureAxiosToken(token);
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public async signIn({ email, password }: LoginCredentials): Promise<void> {
    if (!this.initialized) {
      throw new Error('AuthService not initialized');
    }

    console.log('AuthService: Starting login...', { email });
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('AuthService: Server response:', response.data);
      
      const { token, user } = response.data;
      this.token = token;
      this.user = user;

      await AsyncStorage.setItem('@KidsBook:token', token);
      console.log('AuthService: Token stored successfully');
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    if (!this.initialized) {
      throw new Error('AuthService not initialized');
    }

    this.token = null;
    this.user = null;
    await AsyncStorage.removeItem('@KidsBook:token');
    console.log('AuthService: Logout successful');
  }

  public async verifyToken(): Promise<boolean> {
    try {
      if (!this.state.token) {
        console.log('AuthService: No token found');
        return false;
      }

      const response = await api.get(API_ROUTES.VERIFY);
      console.log('AuthService: Token verified successfully');
      return response.status === 200;
    } catch (error) {
      console.error('AuthService: Token verification failed:', error);
      await this.signOut();
      return false;
    }
  }

  public async updateUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
      this.state.user = user;
      console.log('AuthService: User updated successfully');
    } catch (error) {
      console.error('AuthService: Error updating user:', error);
      throw error;
    }
  }
}