import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9E2A2B',       // Crimson Spice Red
      light: '#C93B3C',      // Soft Crimson Red
      dark: '#6E1B1C',       // Deep Mahogany Red
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E09F3E',       // Spiced Honey Gold
      light: '#F4D39D',      // Soft Gold Tint
      dark: '#B0751A',       // Rich Amber Gold
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFDF9',    // Vanilla Cream
      paper: '#FFFFFF',
    },
    text: {
      primary: '#330F11',    // Mahogany Crimson
      secondary: '#6E4F51',  // Warm Rose Slate
    },
    info: {
      main: '#E09F3E',       // Spiced Honey Gold accent
    },
    error: {
      main: '#C0392B',
    },
    warning: {
      main: '#D4AC0D',
    },
    success: {
      main: '#27AE60',
    },
  },
  typography: {
    fontFamily: [
      '"Outfit"',
      '"Inter"',
      '"Roboto"',
      '"Helvetica"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16, // Premium soft corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(158, 42, 43, 0.15)',
          },
          '&:focus-visible': {
            outline: '3px solid #E09F3E',
            outlineOffset: '2px',
          },
          '&.MuiButton-containedPrimary:hover': {
            backgroundColor: '#832223',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'border-color 0.2s ease-in-out',
            backgroundColor: '#FDFCFB',
            '&:hover fieldset': {
              borderColor: '#E09F3E',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9E2A2B',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.05)',
          border: '1px solid rgba(224, 159, 62, 0.2)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});
