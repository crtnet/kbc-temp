import React, { createContext, useContext, useState, useCallback } from 'react';

interface BookPage {
  elements: Array<{
    type: 'text' | 'image' | 'character';
    position: { x: number; y: number };
    content: any;
  }>;
}

interface Book {
  id: string;
  title: string;
  pages: BookPage[];
}

interface BookPreviewContextData {
  book: Book | null;
  currentPage: number;
  setBook: (book: Book) => void;
  setCurrentPage: (page: number) => void;
  updatePageElement: (pageIndex: number, elementIndex: number, newElement: any) => void;
}

const BookPreviewContext = createContext<BookPreviewContextData>({} as BookPreviewContextData);

export const BookPreviewProvider: React.FC = ({ children }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const updatePageElement = useCallback((pageIndex: number, elementIndex: number, newElement: any) => {
    if (!book) return;

    const updatedBook = { ...book };
    updatedBook.pages[pageIndex].elements[elementIndex] = {
      ...updatedBook.pages[pageIndex].elements[elementIndex],
      ...newElement,
    };

    setBook(updatedBook);
  }, [book]);

  return (
    <BookPreviewContext.Provider
      value={{
        book,
        currentPage,
        setBook,
        setCurrentPage,
        updatePageElement,
      }}
    >
      {children}
    </BookPreviewContext.Provider>
  );
};

export const useBookPreview = () => {
  const context = useContext(BookPreviewContext);

  if (!context) {
    throw new Error('useBookPreview must be used within a BookPreviewProvider');
  }

  return context;
};