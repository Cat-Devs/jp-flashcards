import { blue, blueGrey, red } from '@mui/material/colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
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
    caption: {
      color: blueGrey['300'],
    },
    overline: {
      color: blue['400'],
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: blue['400'],
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
