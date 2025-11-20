'use client';

import { createTheme } from '@mui/material/styles';

// Custom colors for the they brand
export const theyColors = {
  yellow: '#F7B85A',
  blue: '#164656',
  red: '#EA5837',
};

const theme = createTheme({
  palette: {
    primary: {
      main: theyColors.blue,
      contrastText: '#ffffff',
    },
    secondary: {
      main: theyColors.yellow,
      contrastText: '#000000',
    },
    error: {
      main: theyColors.red,
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;

