// frontend/src/services/auth/AuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../config/axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

export class AuthService {
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
        try {
          const response = await axiosInstance.get('/auth/verify', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          this.user = response.data.user;
        } catch (error) {
          console.log('AuthService: Invalid token, clearing...');
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

  public async signIn({ email, password }: SignInCredentials): Promise<void> {
    if (!this.initialized) {
      throw new Error('AuthService not initialized');
    }

    console.log('AuthService: Starting login...', { email });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
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
}