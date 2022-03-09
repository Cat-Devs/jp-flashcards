import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React, { useEffect } from 'react';
import { useApp } from '../../src/AppState';
import { LoadingCard } from '../../src/Components/LoadingCard';
import { FlashCardData } from '../../src/types';

interface ShufflePageProps {
  cards: FlashCardData[];
}

const ShufflePage: React.FC<ShufflePageProps> = () => {
  const { loadData, loading } = useApp();

  useEffect(() => {
    if (!loading) {
      loadData();
    }
  }, [loadData, loading]);

  return (
    <Container maxWidth="md" disableGutters>
      <Box sx={{ p: 2 }}>
        <LoadingCard />
      </Box>
    </Container>
  );
};

export default ShufflePage;
