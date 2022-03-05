import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';

interface CardNotFoundProps {
  onGoHome: () => void;
}

export const CardNotFound: React.FC<CardNotFoundProps> = ({ onGoHome }) => {
  return (
    <Card data-cy="flashcard-not-found">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Card Not Found
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="primary" onClick={onGoHome}>
          Go Home
        </Button>
      </CardActions>
    </Card>
  );
};
