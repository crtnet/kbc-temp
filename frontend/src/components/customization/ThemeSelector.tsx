import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, RadioButton } from 'react-native-paper';
import { bookThemes } from '../../styles/themes';
import { Theme } from '../../types/customization';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeSelect,
}) => {
  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title>Tema Visual</Title>
        <View style={styles.optionsContainer}>
          {Object.entries(bookThemes).map(([key, theme]) => (
            <RadioButton.Item
              key={key}
              label={theme.name}
              value={key}
              status={selectedTheme === key ? 'checked' : 'unchecked'}
              onPress={() => onThemeSelect(key as Theme)}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  optionsContainer: {
    marginTop: 10,
  },
});