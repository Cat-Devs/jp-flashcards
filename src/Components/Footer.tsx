import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Copyright } from './Copyright';

export const Footer = () => {
  return (
    <Box py={1}>
      <Copyright />
      <Typography variant="body2" color="textSecondary" align="center">
        release version <Typography variant="overline">{process.env.VERCEL_GIT_COMMIT_SHA || 'dev'}</Typography>
      </Typography>
    </Box>
  );
};
