import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useApp } from '../AppState';
import { Footer } from '../Components/Footer';
import { TopBar } from '../Components/TopBar';
import { theme } from '../theme';

export const AppWrapper = (props) => {
  const { fetchUserData, authenticating } = useApp();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
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
        <Box sx={{ flex: '1 1 auto' }} />
        <Footer />
      </Box>
    </ThemeProvider>
  );
};
