import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../src/AppState';
import { CardNotFound } from '../../src/Components/CardNotFound';
import { ResultPage } from '../../src/Pages/ResultPage';

const Summary: React.FC = () => {
  const { currentCard, loading, goHome } = useApp();
  const [prepareRound, setPrepareRound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentCard) {
      router.push(`/shuffle/${currentCard}`);
      setPrepareRound(true);
    }
  }, [currentCard, router]);

  if ((!loading && !Boolean(currentCard)) || prepareRound) {
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
        <CardNotFound onGoHome={goHome} />
      </Box>
    </Container>
  );
};

export default Summary;
