import React, { createContext, useContext, useState, useCallback } from 'react';

interface PreviewContextData {
  currentPage: number;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
}

const PreviewContext = createContext<PreviewContextData>({} as PreviewContextData);

export const PreviewProvider: React.FC = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return (
    <PreviewContext.Provider
      value={{
        currentPage,
        totalPages,
        setTotalPages,
        nextPage,
        previousPage,
        goToPage,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => {
  const context = useContext(PreviewContext);

  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }

  return context;
};