import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useApp } from '../AppState';
import { UserMenu } from '../Components/UserMenu';
import { theme } from '../theme';

export const AppWrapper = (props) => {
  const { goHome, userLoggedIn, userHash, logIn, logOut, authenticating } = useApp();

  return (
    <ThemeProvider theme={theme}>
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
                signedIn={Boolean(userLoggedIn && userHash)}
                userHash={userHash}
                onLogIn={logIn}
                onLogOut={logOut}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {authenticating ? (
        <Container>
          <Box sx={{ textAlign: 'center', pt: '140px' }}>
            <CircularProgress size={80} />
          </Box>
        </Container>
      ) : (
        props.children
      )}
    </ThemeProvider>
  );
};
