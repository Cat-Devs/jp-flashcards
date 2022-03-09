import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useApp } from '../../src/AppState';
import { LoadingCard } from '../../src/Components/LoadingCard';
import { ResultPage } from '../../src/Pages/ResultPage';

const Summary: React.FC = () => {
  const { currentCard, loading } = useApp();

  const router = useRouter();

  useEffect(() => {
    if (currentCard) {
      router.push(`/shuffle/${currentCard}`);
    }
  }, [currentCard, router]);

  if (!loading && !currentCard) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <ResultPage />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Box sx={{ p: 2 }}>
        <LoadingCard />
      </Box>
    </Container>
  );
};

export default Summary;
