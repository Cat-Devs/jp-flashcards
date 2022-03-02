import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="https://jp-flashcards.vercel.app">
        Japanese Flashcards
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
