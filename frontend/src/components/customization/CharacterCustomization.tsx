import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, TextInput } from 'react-native-paper';
import { CharacterDetails } from '../../types/customization';

interface CharacterCustomizationProps {
  character: CharacterDetails;
  onCharacterUpdate: (character: CharacterDetails) => void;
}

export const CharacterCustomization: React.FC<CharacterCustomizationProps> = ({
  character,
  onCharacterUpdate,
}) => {
  const handleUpdate = (field: keyof CharacterDetails, value: string) => {
    onCharacterUpdate({
      ...character,
      [field]: value,
    });
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title>Personalização do Personagem</Title>
        <View style={styles.formContainer}>
          <TextInput
            label="Nome"
            value={character.name}
            onChangeText={(value) => handleUpdate('name', value)}
            style={styles.input}
          />
          <TextInput
            label="Personalidade"
            value={character.personality.traits.join(', ')}
            onChangeText={(value) => 
              handleUpdate('personality', {
                ...character.personality,
                traits: value.split(',').map(trait => trait.trim())
              })
            }
            style={styles.input}
          />
          {/* Adicione mais campos conforme necessário */}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  formContainer: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
  },
});