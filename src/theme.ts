import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const theme = createTheme({
  typography: {
    fontSize: 18,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#ff1744",
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: "#0a1929",
      default: "#0a1929",
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});
