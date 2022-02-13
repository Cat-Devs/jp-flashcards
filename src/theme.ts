import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { createBreakpoints } from '@mui/system';

const breakpoints = createBreakpoints({});

breakpoints;
const baseTheme = createTheme({
  typography: {
    fontFamily: "'Noto Sans JP', serif",
    fontSize: 18,
    h4: {
      [breakpoints.down('sm')]: {
        fontSize: '1.6rem',
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff1744',
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: '#0c2137',
      default: '#0c2137',
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
