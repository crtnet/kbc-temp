import { useState, useCallback } from 'react';

interface BookPage {
  id: string;
  content: React.ReactNode;
  background?: string;
}

export const useBookPreview = (initialPages: BookPage[] = []) => {
  const [pages, setPages] = useState<BookPage[]>(initialPages);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const addPage = useCallback((page: BookPage) => {
    setPages((prev) => [...prev, page]);
  }, []);

  const removePage = useCallback((pageId: string) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  }, []);

  const updatePage = useCallback((pageId: string, updates: Partial<BookPage>) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, ...updates } : p))
    );
  }, []);

  const movePage = useCallback((fromIndex: number, toIndex: number) => {
    setPages((prev) => {
      const newPages = [...prev];
      const [removed] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, removed);
      return newPages;
    });
  }, []);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
    setCurrentPage(0);
  }, []);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
    }
  }, [pages.length]);

  return {
    pages,
    currentPage,
    isPreviewMode,
    addPage,
    removePage,
    updatePage,
    movePage,
    togglePreviewMode,
    goToPage,
  };
};