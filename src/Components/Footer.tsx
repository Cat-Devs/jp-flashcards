import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Copyright } from './Copyright';

interface FooterProps {
  version: string;
}

export const Footer: React.FC<FooterProps> = ({ version }) => (
  <Box py={1}>
    <Copyright />
    <Typography variant="body2" color="textSecondary" align="center">
      release version <Typography variant="overline">{version || 'dev'}</Typography>
    </Typography>
  </Box>
);
