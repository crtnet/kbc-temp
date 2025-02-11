import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { Navigation } from './src/navigation';
import { ErrorBoundary } from './src/components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
