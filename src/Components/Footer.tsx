import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Copyright } from './Copyright';

export const Footer = () => {
  console.log(process.env);
  return (
    <Box py={1}>
      <Copyright />
      <Typography variant="body2" color="textSecondary" align="center">
        release version <Typography variant="overline">{process.env.REACT_APP_GIT_HASH || 'dev'}</Typography>
      </Typography>
    </Box>
  );
};
