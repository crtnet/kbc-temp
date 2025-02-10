import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { AUTH_STORAGE_KEYS, API_ROUTES } from './constants';
import type { AuthResponse, LoginCredentials, AuthState, User } from './types';

class AuthService {
  private static instance: AuthService;
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false
  };

  private constructor() {
    // Private constructor to enforce singleton
    this.initialize();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initialize() {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(AUTH_STORAGE_KEYS.USER),
      ]);

      if (storedToken && storedUser) {
        this.state = {
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true
        };
        this.configureAxiosToken(storedToken);
      }
    } catch (error) {
      console.error('AuthService: Error initializing:', error);
    }
  }

  private configureAxiosToken(token: string | null) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('AuthService: Token configured in axios headers');
    } else {
      delete api.defaults.headers.common['Authorization'];
      console.log('AuthService: Token removed from axios headers');
    }
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public async signIn(credentials: LoginCredentials): Promise<void> {
    try {
      console.log('AuthService: Starting login...');
      const response = await api.post<AuthResponse>(API_ROUTES.LOGIN, credentials);
      const { user, token } = response.data;

      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token),
        AsyncStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user))
      ]);

      this.state = {
        user,
        token,
        isAuthenticated: true
      };

      this.configureAxiosToken(token);
      console.log('AuthService: Login successful');
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(AUTH_STORAGE_KEYS.USER)
      ]);

      this.state = {
        user: null,
        token: null,
        isAuthenticated: false
      };

      this.configureAxiosToken(null);
      console.log('AuthService: Logout successful');
    } catch (error) {
      console.error('AuthService: Logout error:', error);
      throw error;
    }
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