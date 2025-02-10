import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Card, Snackbar, IconButton } from 'react-native-paper';
import { ThemeSelector } from '../components/customization/ThemeSelector';
import { CharacterCustomization } from '../components/customization/CharacterCustomization';
import { StorySettings } from '../components/customization/StorySettings';
import { Theme, CharacterDetails, StorySettings as StorySettingsType } from '../types/customization';
import { useAuth } from '../contexts/AuthContext';
import { useAutoSave } from '../hooks/useAutoSave';
import api from '../services/api';

interface BookData {
  title: string;
  genre: string;
  theme: string;
  mainCharacter: string;
  setting: string;
  tone: string;
  visualTheme: Theme;
  characterDetails: CharacterDetails;
  storySettings: StorySettings;
}

export default function CreateBookScreen({ navigation }) {
  console.log('CreateBookScreen: Iniciando renderização');
  
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    console.log('CreateBookScreen: Verificando autenticação');
    if (!user) {
      console.log('CreateBookScreen: Usuário não autenticado');
      navigation.navigate('Login');
      return;
    }
    console.log('CreateBookScreen: Usuário autenticado:', user);
  }, [user, navigation]);
  
  const [bookData, setBookData] = useState<BookData>({
    title: '',
    genre: 'adventure',
    theme: 'friendship',
    mainCharacter: '',
    setting: '',
    tone: 'fun',
    visualTheme: 'classic',
    characterDetails: {
      name: '',
      personality: {
        traits: [],
        motivation: '',
        fears: [],
      },
      appearance: {
        height: '',
        hairColor: '',
        eyeColor: '',
        clothing: '',
      },
      relationships: {
        family: [],
        friends: [],
        others: [],
      },
    },
    storySettings: {
      structure: 'linear',
      emotionalTone: [],
      educationalElements: {
        subjects: [],
        learningGoals: [],
        ageGroup: '',
      },
      pacing: 'medium',
      narrativeStyle: 'third-person',
    }
  });

  // Configurar autosave
  const { updateData, forceSave } = useAutoSave(bookData, {
    interval: 30000, // Auto-save a cada 30 segundos
    onSave: (savedData) => {
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(null), 3000);
    },
    onError: (error) => {
      setAutoSaveStatus('error');
      setError('Erro ao salvar automaticamente: ' + error.message);
      setVisible(true);
    }
  });

  // Atualizar dados no autosave quando bookData mudar
  useEffect(() => {
    updateData(bookData);
  }, [bookData]);

  // Verificar se existe um rascunho ao carregar
  useEffect(() => {
    const checkDraft = async () => {
      try {
        const response = await api.get('/books/draft/latest');
        const draft = response.data;
        
        if (draft && window.confirm('Deseja continuar o rascunho anterior?')) {
          setBookData(draft);
          setStep(determineStep(draft));
          setLastSaved(new Date(draft.lastAutoSave));
          setAutoSaveStatus('saved');
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Erro ao buscar rascunho:', error);
        }
      }
    };

    checkDraft();
  }, []);

  const handleNext = () => {
    if (step === 1 && !bookData.title) {
      setError('Por favor, insira um título para o livro');
      setVisible(true);
      return;
    }

    if (step === 2 && (!bookData.mainCharacter || !bookData.setting)) {
      setError('Por favor, preencha todos os campos');
      setVisible(true);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleCreateBook();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  // Determinar em qual etapa o usuário parou
  const determineStep = (data: BookData): number => {
    if (!data.title) return 1;
    if (!data.mainCharacter || !data.setting) return 2;
    return 3;
  };
  const handleCreateBook = async () => {
    try {
      setLoading(true);
      
      // Forçar último salvamento antes de criar o livro
      await forceSave();
      
      console.log('Criando livro:', bookData);
      const response = await api.post('/books', bookData);
      console.log('Livro criado:', response.data);
      
      navigation.navigate('ViewBook', { bookId: response.data.bookId });
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      setError(error.response?.data?.message || 'Erro ao criar livro');
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Informações Básicas</Text>
      
      <TextInput
        label="Título do Livro"
        value={bookData.title}
        onChangeText={(text) => setBookData({ ...bookData, title: text })}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Gênero</Text>
      <SegmentedButtons
        value={bookData.genre}
        onValueChange={(value) => setBookData({ ...bookData, genre: value })}
        buttons={[
          { value: 'adventure', label: 'Aventura' },
          { value: 'fantasy', label: 'Fantasia' },
          { value: 'mystery', label: 'Mistério' }
        ]}
        style={styles.segmentedButton}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Personagem e Ambiente</Text>
      
      <TextInput
        label="Nome do Personagem Principal"
        value={bookData.mainCharacter}
        onChangeText={(text) => setBookData({ ...bookData, mainCharacter: text })}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Cenário da História"
        value={bookData.setting}
        onChangeText={(text) => setBookData({ ...bookData, setting: text })}
        mode="outlined"
        style={styles.input}
        placeholder="Ex: floresta encantada, cidade mágica..."
      />
    </View>
  );
  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Tema e Tom da História</Text>

      <Text style={styles.label}>Tema Principal</Text>
      <SegmentedButtons
        value={bookData.theme}
        onValueChange={(value) => setBookData({ ...bookData, theme: value })}
        buttons={[
          { value: 'friendship', label: 'Amizade' },
          { value: 'courage', label: 'Coragem' },
          { value: 'kindness', label: 'Bondade' }
        ]}
        style={styles.segmentedButton}
      />

      <Text style={styles.label}>Tom da Narrativa</Text>
      <SegmentedButtons
        value={bookData.tone}
        onValueChange={(value) => setBookData({ ...bookData, tone: value })}
        buttons={[
          { value: 'fun', label: 'Divertido' },
          { value: 'adventurous', label: 'Aventureiro' },
          { value: 'calm', label: 'Calmo' }
        ]}
        style={styles.segmentedButton}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Indicador de Auto-save */}
          <View style={styles.autoSaveContainer}>
            {autoSaveStatus === 'saving' && (
              <Text style={styles.autoSaveText}>Salvando...</Text>
            )}
            {autoSaveStatus === 'saved' && (
              <View style={styles.autoSaveRow}>
                <IconButton icon="check-circle" size={16} color="#4CAF50" />
                <Text style={[styles.autoSaveText, { color: '#4CAF50' }]}>
                  Salvo {lastSaved ? `às ${lastSaved.toLocaleTimeString()}` : ''}
                </Text>
              </View>
            )}
            {autoSaveStatus === 'error' && (
              <View style={styles.autoSaveRow}>
                <IconButton icon="alert-circle" size={16} color="#f44336" />
                <Text style={[styles.autoSaveText, { color: '#f44336' }]}>
                  Erro ao salvar
                </Text>
              </View>
            )}
          </View>

          {/* Indicador de Progresso */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((item) => (
              <View
                key={item}
                style={[
                  styles.progressItem,
                  { backgroundColor: item <= step ? '#1976d2' : '#e0e0e0' }
                ]}
              />
            ))}
          </View>

          {/* Conteúdo do Passo */}
          {step === 1 && (
            <>
              {renderStep1()}
              <ThemeSelector
                selectedTheme={bookData.visualTheme}
                onThemeSelect={(theme) => setBookData({ ...bookData, visualTheme: theme })}
              />
            </>
          )}
          {step === 2 && (
            <>
              {renderStep2()}
              <CharacterCustomization
                character={bookData.characterDetails}
                onCharacterUpdate={(character) => setBookData({ ...bookData, characterDetails: character })}
              />
            </>
          )}
          {step === 3 && (
            <>
              {renderStep3()}
              <StorySettings
                settings={bookData.storySettings}
                onSettingsUpdate={(settings) => setBookData({ ...bookData, storySettings: settings })}
              />
            </>
          )}

          {/* Botões de Navegação */}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleBack}
              style={styles.button}
              disabled={loading}
            >
              {step === 1 ? 'Cancelar' : 'Voltar'}
            </Button>
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              {step === 3 ? 'Criar Livro' : 'Próximo'}
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  autoSaveContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  autoSaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoSaveText: {
    fontSize: 12,
    color: '#666',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressItem: {
    flex: 1,
    height: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  segmentedButton: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});