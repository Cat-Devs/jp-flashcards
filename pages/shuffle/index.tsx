import React, { useEffect } from 'react';
import { useApp } from '../../src/AppState';
import { FlashcardPage } from '../../src/Pages/FlashcardPage';
import { FlashCardData } from '../../src/types';

interface WordsProps {
  cards: FlashCardData[];
}

const CardPage: React.FC<WordsProps> = () => {
  const { loadData, loading } = useApp();

  useEffect(() => {
    if (!loading) {
      loadData();
    }
  }, [loadData, loading]);

  return <FlashcardPage />;
};

export default CardPage;
