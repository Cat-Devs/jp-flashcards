import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import React from 'react';

export const KeyboardHelper = () => {
  return (
    <Box pb={2} sx={{ textAlign: 'center' }}>
      <Typography gutterBottom variant="h6">
        Navigate with your keyboard
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '4px 14px',
            alignItems: 'center',
          }}
        >
          <Avatar variant="rounded" sx={{ bgcolor: blueGrey[600], marginBottom: '4px' }}>
            <ArrowLeft />
          </Avatar>
          <Typography>Wrong</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '4px 14px',
            alignItems: 'center',
          }}
        >
          <Avatar variant="rounded" sx={{ bgcolor: blueGrey[600], marginBottom: '4px' }}>
            <SpaceBarIcon />
          </Avatar>
          <Typography>Check Answer</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: '4px 14px',
            alignItems: 'center',
          }}
        >
          <Avatar variant="rounded" sx={{ bgcolor: blueGrey[600], marginBottom: '4px' }}>
            <ArrowRight />
          </Avatar>
          <Typography>Correct</Typography>
        </Box>
      </Box>
    </Box>
  );
};
