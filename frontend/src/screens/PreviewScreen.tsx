import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BookPreview } from '../components/BookPreview/BookPreview';
import { useBookPreview } from '../hooks/useBookPreview';

export const PreviewScreen: React.FC = () => {
  const {
    pages,
    currentPage,
    isPreviewMode,
    goToPage,
    togglePreviewMode,
  } = useBookPreview();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.previewContainer}>
        <BookPreview pages={pages} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
});