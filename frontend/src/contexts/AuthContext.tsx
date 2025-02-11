// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { AuthService } from '../services/auth/AuthService';
import { globalStyles } from '../styles/global';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authService, setAuthService] = useState<AuthService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing AuthService...');
        const service = await AuthService.getInstance();
        setAuthService(service);
        setUser(service.getUser());
        console.log('AuthContext: AuthService initialized successfully');
      } catch (error) {
        console.error('AuthContext: Error initializing AuthService:', error);
        setError('Failed to initialize authentication service');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    if (!authService) {
      throw new Error('Authentication service not available');
    }

    try {
      console.log('AuthContext: Attempting login...');
      await authService.signIn({ email, password });
      setUser(authService.getUser());
      console.log('AuthContext: Login successful');
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  }, [authService]);

  const signOut = useCallback(async () => {
    if (!authService) {
      throw new Error('Authentication service not available');
    }

    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('AuthContext: Logout failed:', error);
      throw error;
    }
  }, [authService]);

  if (loading) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.error}>
        <Text style={globalStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}