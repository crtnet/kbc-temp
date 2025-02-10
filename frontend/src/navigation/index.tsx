import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BookPreviewScreen } from '../screens/BookPreviewScreen';

const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="BookPreview"
          component={BookPreviewScreen}
          options={{ title: 'Book Preview' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};