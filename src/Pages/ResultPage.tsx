import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { useApp } from '../AppState';
import { LoadingCard } from '../Components/LoadingCard';

export const ResultPage: React.FC = () => {
  const { goHome, loading, playWrongCards, gameStats, getGameStats } = useApp();

  useEffect(() => {
    getGameStats();
  }, [getGameStats]);

  if (loading) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Challenge completed.
            </Typography>
            {gameStats.wrongCards ? (
              <Typography gutterBottom variant="h5" component="div">
                You have missed {gameStats.wrongCards} cards.
              </Typography>
            ) : (
              <Typography gutterBottom variant="h5" component="div">
                You have correctly guessed all the cards.
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button color="primary" onClick={goHome}>
              Go Home
            </Button>
            {gameStats.wrongCards ? (
              <Button color="primary" onClick={playWrongCards}>
                Play wrong cards
              </Button>
            ) : null}
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};
