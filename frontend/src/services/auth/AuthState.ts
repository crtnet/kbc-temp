// frontend/src/services/auth/AuthState.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
}

class AuthStateManager {
  private static instance: AuthStateManager | null = null;
  private static readonly TOKEN_KEY = '@KidsBook:token';
  private static readonly USER_KEY = '@KidsBook:user';

  private state: AuthState = {
    token: null,
    user: null,
    isInitialized: false
  };

  private constructor() {}

  public static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public getToken(): string | null {
    return this.state.token;
  }

  public getUser(): User | null {
    return this.state.user ? { ...this.state.user } : null;
  }

  public isAuthenticated(): boolean {
    return !!this.state.token;
  }

  public isInitialized(): boolean {
    return this.state.isInitialized;
  }

  public async loadPersistedState(): Promise<void> {
    try {
      console.log('AuthStateManager: Loading persisted state...');
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem(AuthStateManager.TOKEN_KEY),
        AsyncStorage.getItem(AuthStateManager.USER_KEY)
      ]);

      this.state.token = token;
      this.state.user = userStr ? JSON.parse(userStr) : null;
      this.state.isInitialized = true;

      console.log('AuthStateManager: State loaded successfully');
    } catch (error) {
      console.error('AuthStateManager: Error loading state:', error);
      this.clearState();
      throw error;
    }
  }

  public async updateState(token: string | null, user: User | null): Promise<void> {
    try {
      console.log('AuthStateManager: Updating state...');
      this.state.token = token;
      this.state.user = user;

      if (token && user) {
        await Promise.all([
          AsyncStorage.setItem(AuthStateManager.TOKEN_KEY, token),
          AsyncStorage.setItem(AuthStateManager.USER_KEY, JSON.stringify(user))
        ]);
      } else {
        await this.clearPersistedState();
      }

      console.log('AuthStateManager: State updated successfully');
    } catch (error) {
      console.error('AuthStateManager: Error updating state:', error);
      throw error;
    }
  }

  public async clearState(): Promise<void> {
    try {
      console.log('AuthStateManager: Clearing state...');
      this.state.token = null;
      this.state.user = null;
      await this.clearPersistedState();
      console.log('AuthStateManager: State cleared successfully');
    } catch (error) {
      console.error('AuthStateManager: Error clearing state:', error);
      throw error;
    }
  }

  private async clearPersistedState(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(AuthStateManager.TOKEN_KEY),
      AsyncStorage.removeItem(AuthStateManager.USER_KEY)
    ]);
  }
}

export const authState = AuthStateManager.getInstance();