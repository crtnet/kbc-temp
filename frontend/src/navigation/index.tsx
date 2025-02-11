import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/Login';
import { HomeScreen } from '../screens/Home';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export function Navigation() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {signed ? (
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
