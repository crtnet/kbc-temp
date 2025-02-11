// frontend/src/App.tsx
import React from 'react';
import { View } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { LoginScreen } from './screens/Login';

export function App() {
  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    </View>
  );
}