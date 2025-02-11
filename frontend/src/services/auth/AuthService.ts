// frontend/src/services/auth/AuthService.ts
import { axiosInstance } from '../config/axios';
import { setupInterceptors } from '../config/axios-interceptors';
import { authState, User } from './AuthState';

interface SignInCredentials {
  email: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService | null = null;
  private static initializationPromise: Promise<AuthService> | null = null;

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
      
      // Carregar estado persistido
      await authState.loadPersistedState();
      console.log('AuthService: Retrieved stored data');

      // Se houver token, verificar sua validade
      if (authState.getToken()) {
        try {
          console.log('AuthService: Verifying token...');
          const response = await axiosInstance.get('/auth/verify');
          await authState.updateState(authState.getToken(), response.data.user);
          console.log('AuthService: Token verified successfully');
        } catch (error) {
          console.log('AuthService: Invalid token, clearing session...');
          await this.signOut();
        }
      } else {
        console.log('AuthService: No stored token found');
      }

      console.log('AuthService: Initialized successfully');
    } catch (error) {
      console.error('AuthService: Initialization error:', error);
      await authState.clearState();
      throw error;
    }
  }

  public async signIn({ email, password }: SignInCredentials): Promise<void> {
    if (!authState.isInitialized()) {
      throw new Error('AuthService not initialized');
    }

    console.log('AuthService: Starting login...', { email });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log('AuthService: Server response received');
      
      const { token, user } = response.data;
      await authState.updateState(token, user);
      
      console.log('AuthService: Authentication data stored successfully');
    } catch (error) {
      console.error('AuthService: Login error:', error);
      await authState.clearState();
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    if (!authState.isInitialized()) {
      throw new Error('AuthService not initialized');
    }

    console.log('AuthService: Starting sign out...');
    try {
      if (authState.isAuthenticated()) {
        try {
          await axiosInstance.post('/auth/logout');
          console.log('AuthService: Logged out from server');
        } catch (error) {
          console.warn('AuthService: Error logging out from server:', error);
        }
      }

      await authState.clearState();
      console.log('AuthService: Sign out completed successfully');
    } catch (error) {
      console.error('AuthService: Error during sign out:', error);
      throw error;
    }
  }

  public getToken(): string | null {
    return authState.getToken();
  }

  public getUser(): User | null {
    return authState.getUser();
  }

  public isAuthenticated(): boolean {
    return authState.isAuthenticated();
  }

  public isInitialized(): boolean {
    return authState.isInitialized();
  }

  public async refreshSession(): Promise<void> {
    if (!authState.isInitialized()) {
      throw new Error('AuthService not initialized');
    }

    if (!authState.getToken()) {
      throw new Error('No token available for refresh');
    }

    console.log('AuthService: Refreshing session...');
    try {
      const response = await axiosInstance.post('/auth/refresh');
      const { token, user } = response.data;
      await authState.updateState(token, user);
      console.log('AuthService: Session refreshed successfully');
    } catch (error) {
      console.error('AuthService: Session refresh failed:', error);
      await this.signOut();
      throw error;
    }
  }
}