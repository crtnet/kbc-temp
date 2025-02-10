import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Checkbox, Text } from 'react-native-paper';
import { StorySettings as StorySettingsType } from '../../types/customization';

interface StorySettingsProps {
  settings: StorySettingsType;
  onSettingsUpdate: (settings: StorySettingsType) => void;
}

export const StorySettings: React.FC<StorySettingsProps> = ({
  settings,
  onSettingsUpdate,
}) => {
  const handleStructureChange = (structure: StorySettingsType['structure']) => {
    onSettingsUpdate({
      ...settings,
      structure,
    });
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title>Configurações da História</Title>
        <View style={styles.optionsContainer}>
          <Text>Estrutura da História:</Text>
          <View style={styles.checkboxGroup}>
            <Checkbox.Item
              label="Linear"
              status={settings.structure === 'linear' ? 'checked' : 'unchecked'}
              onPress={() => handleStructureChange('linear')}
            />
            <Checkbox.Item
              label="Ramificada"
              status={settings.structure === 'branching' ? 'checked' : 'unchecked'}
              onPress={() => handleStructureChange('branching')}
            />
            <Checkbox.Item
              label="Circular"
              status={settings.structure === 'circular' ? 'checked' : 'unchecked'}
              onPress={() => handleStructureChange('circular')}
            />
          </View>
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
  checkboxGroup: {
    marginLeft: 20,
  },
});