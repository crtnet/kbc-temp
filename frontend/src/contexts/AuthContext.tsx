import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiConfig } from '../config/api';

interface AuthContextData {
  signed: boolean;
  user: object | null;
  loading: boolean;
  signIn(credentials: { email: string; password: string }): Promise<void>;
  signOut(): void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem('@KBC:user'),
          AsyncStorage.getItem('@KBC:token')
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading storage data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { apiUrl } = getApiConfig();
      console.log('Attempting to sign in with API:', apiUrl);

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.user || !data.token) {
        throw new Error('Invalid response format');
      }

      setUser(data.user);
      await AsyncStorage.setItem('@KBC:user', JSON.stringify(data.user));
      await AsyncStorage.setItem('@KBC:token', data.token);
      
      console.log('Successfully signed in');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['@KBC:user', '@KBC:token']);
      setUser(null);
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
