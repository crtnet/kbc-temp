import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/auth/AuthService';
import type { User } from '../services/auth/types';

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authService = AuthService.getInstance();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(authService.getState());

  useEffect(() => {
    async function initializeAuth() {
      try {
        console.log('AuthContext: Checking token validity...');
        const isValid = await authService.verifyToken();
        
        if (!isValid) {
          console.log('AuthContext: Invalid token, logging out...');
          await authService.signOut();
        }
        
        setState(authService.getState());
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    }

    // Listen for unauthorized events
    const handleUnauthorized = () => {
      console.log('AuthContext: Received unauthorized event');
      signOut();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    initializeAuth();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login...');
      await authService.signIn({ email, password });
      setState(authService.getState());
      console.log('AuthContext: Login successful!');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting logout...');
      await authService.signOut();
      setState(authService.getState());
      console.log('AuthContext: Logout successful!');
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        signed: state.isAuthenticated,
        user: state.user,
        loading,
        signIn,
        signOut
      }}
    >
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