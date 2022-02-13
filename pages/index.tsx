import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Copyright from '../src/Components/Copyright';
import { useRouter } from 'next/router';
import { Settings } from '../src/Components/Settings';

const Index: React.FC = () => {
  const router = useRouter();

  const handleStartGame = () => {
    router.push('/shuffle');
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} sx={{ textAlign: 'center' }}>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Japanese Flashcards
          </Typography>
        </Box>
        <Settings />
        <Box my={4}>
          <Button variant="outlined" onClick={handleStartGame}>
            Play Words flashcards
          </Button>
        </Box>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Index;
