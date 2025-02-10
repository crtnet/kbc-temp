import { BookData } from '../types/book';

export interface AutoSaveConfig {
  interval?: number;
  onSave?: (data: BookData) => void;
  onError?: (error: Error) => void;
}

class AutoSaveService {
  private timer: NodeJS.Timeout | null = null;
  private config: AutoSaveConfig;
  private currentData: BookData | null = null;
  private isDirty: boolean = false;

  constructor(config: AutoSaveConfig) {
    this.config = {
      interval: 30000, // Default: 30 seconds
      ...config,
    };
  }

  public start(initialData: BookData): void {
    console.log('AutoSaveService: Iniciando com dados:', initialData);
    this.currentData = initialData;
    this.startTimer();
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public updateData(newData: Partial<BookData>): void {
    console.log('AutoSaveService: Atualizando dados:', newData);
    if (this.currentData) {
      this.currentData = {
        ...this.currentData,
        ...newData,
      };
      this.isDirty = true;
      console.log('AutoSaveService: Dados atualizados:', this.currentData);
    } else {
      console.log('AutoSaveService: Sem dados iniciais para atualizar');
    }
  }

  public async forceSave(): Promise<void> {
    if (this.currentData && this.isDirty) {
      try {
        await this.saveData();
        this.isDirty = false;
        this.config.onSave?.(this.currentData);
      } catch (error) {
        this.config.onError?.(error as Error);
      }
    }
  }

  private startTimer(): void {
    this.timer = setInterval(async () => {
      await this.forceSave();
    }, this.config.interval);
  }

  private async saveData(): Promise<void> {
    if (!this.currentData) return;

    try {
      console.log('AutoSaveService: Preparando dados para salvar:', this.currentData);

      // Garantir que todos os campos obrigatórios estejam presentes
      const dataToSave = {
        title: this.currentData.title || '',
        genre: this.currentData.genre || 'fantasy',
        theme: this.currentData.theme || 'friendship',
        mainCharacter: this.currentData.character || '',
        setting: this.currentData.setting || '',
        tone: this.currentData.tone || 'fun',
        status: 'draft'
      };

      console.log('AutoSaveService: Dados formatados:', dataToSave);

      const response = await fetch('/api/books/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          data: dataToSave,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AutoSaveService: Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Failed to auto-save book data');
      }

      const result = await response.json();
      console.log('AutoSaveService: Salvamento bem-sucedido:', result);
    } catch (error) {
      console.error('AutoSaveService: Erro ao salvar:', error);
      this.config.onError?.(error as Error);
      throw error;
    }
  }
}