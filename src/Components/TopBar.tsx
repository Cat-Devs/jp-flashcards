import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useApp } from '../AppState';
import { UserMenu } from './UserMenu';

export const TopBar: React.FC = () => {
  const { goHome, userLoggedIn, userStats, logIn, logOut, authenticating } = useApp();

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}>
            JP-FlashCardS
          </Typography>

          <Box sx={{ flexGrow: 1, display: { sm: 'flex', justifyContent: 'left' } }}>
            <Button variant="text" onClick={goHome} sx={{ my: 2, color: 'white', display: 'block' }}>
              Home
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <UserMenu
              loading={authenticating}
              signedIn={userLoggedIn}
              userHash={userStats?.userHash}
              onLogIn={logIn}
              onLogOut={logOut}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
