import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookPreview } from '../components/BookPreview';
import { BookPreviewProvider } from '../contexts/BookPreviewContext';

export const BookPreviewScreen: React.FC = () => {
  return (
    <BookPreviewProvider>
      <View style={styles.container}>
        <BookPreview />
      </View>
    </BookPreviewProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});