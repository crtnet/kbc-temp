// frontend/src/services/auth/AuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../config/axios';
import { setupInterceptors } from '../config/axios-interceptors';

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
  private static instance: AuthService | null = null;
  private static initializationPromise: Promise<AuthService> | null = null;
  private token: string | null = null;
  private user: User | null = null;
  private initialized = false;
  private static readonly TOKEN_KEY = '@KidsBook:token';
  private static readonly USER_KEY = '@KidsBook:user';

  private constructor() {
    setupInterceptors(axiosInstance);
  }

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
      
      // Recuperar token e usuário do AsyncStorage
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(AuthService.TOKEN_KEY),
        AsyncStorage.getItem(AuthService.USER_KEY)
      ]);

      console.log('AuthService: Retrieved stored data');

      if (storedToken) {
        this.token = storedToken;
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        }

        try {
          console.log('AuthService: Verifying token...');
          const response = await axiosInstance.get('/auth/verify');
          this.user = response.data.user;
          
          // Atualizar usuário no AsyncStorage se necessário
          if (JSON.stringify(this.user) !== storedUser) {
            await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(this.user));
            console.log('AuthService: Updated stored user data');
          }
        } catch (error) {
          console.log('AuthService: Invalid token, clearing session...');
          await this.signOut();
        }
      } else {
        console.log('AuthService: No stored token found');
      }

      this.initialized = true;
      console.log('AuthService: Initialized successfully');
    } catch (error) {
      console.error('AuthService: Initialization error:', error);
      this.initialized = false;
      throw error;
    }
  }

  public async signIn({ email, password }: SignInCredentials): Promise<void> {
    if (!this.initialized) {
      throw new Error('AuthService not initialized');
    }

    console.log('AuthService: Starting login...', { email });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log('AuthService: Server response received');
      
      const { token, user } = response.data;
      
      // Atualizar estado em memória
      this.token = token;
      this.user = user;

      // Persistir dados
      await Promise.all([
        AsyncStorage.setItem(AuthService.TOKEN_KEY, token),
        AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user))
      ]);
      
      console.log('AuthService: Authentication data stored successfully');
    } catch (error) {
      console.error('AuthService: Login error:', error);
      this.token = null;
      this.user = null;
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    if (!this.initialized) {
      throw new Error('AuthService not initialized');
    }

    console.log('AuthService: Starting sign out...');
    try {
      // Limpar estado em memória
      this.token = null;
      this.user = null;

      // Remover dados persistidos
      await Promise.all([
        AsyncStorage.removeItem(AuthService.TOKEN_KEY),
        AsyncStorage.removeItem(AuthService.USER_KEY)
      ]);

      console.log('AuthService: Sign out completed successfully');
    } catch (error) {
      console.error('AuthService: Error during sign out:', error);
      throw error;
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public getUser(): User | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public async refreshSession(): Promise<void> {
    if (!this.initialized) {
      throw new Error('AuthService not initialized');
    }

    if (!this.token) {
      throw new Error('No token available for refresh');
    }

    console.log('AuthService: Refreshing session...');
    try {
      const response = await axiosInstance.post('/auth/refresh');
      const { token, user } = response.data;

      // Atualizar estado em memória
      this.token = token;
      this.user = user;

      // Persistir dados
      await Promise.all([
        AsyncStorage.setItem(AuthService.TOKEN_KEY, token),
        AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user))
      ]);

      console.log('AuthService: Session refreshed successfully');
    } catch (error) {
      console.error('AuthService: Session refresh failed:', error);
      await this.signOut();
      throw error;
    }
  }

  private async clearAuthState(): Promise<void> {
    this.token = null;
    this.user = null;
    await Promise.all([
      AsyncStorage.removeItem(AuthService.TOKEN_KEY),
      AsyncStorage.removeItem(AuthService.USER_KEY)
    ]);
  }
}