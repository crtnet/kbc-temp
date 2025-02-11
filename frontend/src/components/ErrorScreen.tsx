// frontend/src/components/ErrorScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorScreenProps {
  message: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});