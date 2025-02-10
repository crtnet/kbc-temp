import { BookData } from '../types/book';

interface AutoSaveConfig {
  interval: number;
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
    if (this.currentData) {
      this.currentData = {
        ...this.currentData,
        ...newData,
      };
      this.isDirty = true;
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
      const response = await fetch('/api/books/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: this.currentData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to auto-save book data');
      }
    } catch (error) {
      this.config.onError?.(error as Error);
      throw error;
    }
  }
}