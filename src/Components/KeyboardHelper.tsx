import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { blueGrey } from '@mui/material/colors';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';

export const KeyboardHelper = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
      }}
    >
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
