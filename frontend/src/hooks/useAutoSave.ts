import { useEffect, useRef } from 'react';
import { BookData } from '../types/book';
import AutoSaveService from '../services/AutoSaveService';

interface UseAutoSaveOptions {
  interval?: number;
  onSave?: (data: BookData) => void;
  onError?: (error: Error) => void;
}

export function useAutoSave(
  initialData: BookData,
  options: UseAutoSaveOptions = {}
) {
  const autoSaveRef = useRef<AutoSaveService | null>(null);

  useEffect(() => {
    console.log('useAutoSave: Inicializando com dados:', initialData);
    try {
      // Initialize AutoSaveService
      autoSaveRef.current = new AutoSaveService({
        interval: options.interval || 30000,
        onSave: options.onSave,
        onError: options.onError,
      });

      console.log('useAutoSave: AutoSaveService criado');

      // Start AutoSave with initial data
      autoSaveRef.current.start(initialData);
      console.log('useAutoSave: AutoSave iniciado');

      // Cleanup on unmount
      return () => {
        console.log('useAutoSave: Limpando AutoSave');
        if (autoSaveRef.current) {
          autoSaveRef.current.stop();
        }
      };
    } catch (error) {
      console.error('useAutoSave: Erro ao inicializar:', error);
      options.onError?.(error as Error);
    }
  }, []);

  const updateData = (newData: Partial<BookData>) => {
    console.log('useAutoSave: Atualizando dados:', newData);
    try {
      if (autoSaveRef.current) {
        // Mesclar dados existentes com novos dados
        const mergedData = {
          ...autoSaveRef.current.getCurrentData(),
          ...newData
        };
        
        console.log('useAutoSave: Dados mesclados:', mergedData);
        
        // Garantir que todos os campos obrigatórios tenham valores padrão
        const validatedData = {
          title: mergedData.title || '',
          genre: mergedData.genre || 'fantasy',
          theme: mergedData.theme || 'friendship',
          character: mergedData.character || '',
          setting: mergedData.setting || '',
          tone: mergedData.tone || 'fun'
        };
        
        console.log('useAutoSave: Dados validados:', validatedData);
        autoSaveRef.current.updateData(validatedData);
      } else {
        console.warn('useAutoSave: AutoSaveService não inicializado');
        throw new Error('AutoSaveService não inicializado');
      }
    } catch (error) {
      console.error('useAutoSave: Erro ao atualizar dados:', error);
      options.onError?.(error as Error);
    }
  };

  const forceSave = async () => {
    console.log('useAutoSave: Forçando salvamento');
    try {
      if (autoSaveRef.current) {
        await autoSaveRef.current.forceSave();
        console.log('useAutoSave: Salvamento forçado concluído');
      } else {
        console.warn('useAutoSave: AutoSaveService não inicializado');
      }
    } catch (error) {
      console.error('useAutoSave: Erro ao forçar salvamento:', error);
      options.onError?.(error as Error);
      throw error;
    }
  };

  return {
    updateData,
    forceSave,
  };
}