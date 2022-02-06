import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { theme } from "../theme";
import { useApp } from "../AppState";
import { Container } from "@mui/material";

export const AppWrapper = (props) => {
  const { goHome } = useApp();

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}>
              JP-FlashCardS
            </Typography>

            <Box sx={{ flexGrow: 1, display: { display: { sm: "flex" }, justifyContent: "end" } }}>
              <Button variant="text" onClick={goHome} sx={{ my: 2, color: "white", display: "block" }}>
                Home
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
