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
    // Initialize AutoSaveService
    autoSaveRef.current = new AutoSaveService({
      interval: options.interval || 30000,
      onSave: options.onSave,
      onError: options.onError,
    });

    // Start AutoSave with initial data
    autoSaveRef.current.start(initialData);

    // Cleanup on unmount
    return () => {
      if (autoSaveRef.current) {
        autoSaveRef.current.stop();
      }
    };
  }, []);

  const updateData = (newData: Partial<BookData>) => {
    if (autoSaveRef.current) {
      autoSaveRef.current.updateData(newData);
    }
  };

  const forceSave = async () => {
    if (autoSaveRef.current) {
      await autoSaveRef.current.forceSave();
    }
  };

  return {
    updateData,
    forceSave,
  };
}