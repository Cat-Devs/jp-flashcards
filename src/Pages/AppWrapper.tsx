import React, { useCallback, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";

import { theme } from "../theme";
import { useApp } from "../AppState";

export const AppWrapper = (props) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { goHome, isUserLoggedIn, userHash, signIn, signOut } = useApp();

  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}>
              JP-FlashCardS
            </Typography>

            <Box sx={{ flexGrow: 1, display: { sm: "flex", justifyContent: "left" } }}>
              <Button variant="text" onClick={goHome} sx={{ my: 2, color: "white", display: "block" }}>
                Home
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {(isUserLoggedIn && userHash && (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="User avatar" src={`https://avatars.dicebear.com/api/bottts/${userHash}.svg`} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={signOut}>
                      <Typography textAlign="center">Log Out</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )) || (
                <Button variant="text" onClick={signIn} sx={{ my: 2, color: "white", display: "block" }}>
                  Log In
                </Button>
              )}
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
