import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

/**
 * Material-UI Theme Configuration
 * Applies the custom color scheme to all MUI components
 */

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText,
    },
    secondary: {
      main: colors.primary.gradientMiddle,
      light: colors.primary.gradientStart,
      dark: colors.primary.gradientEnd,
      contrastText: colors.primary.contrastText,
    },
    success: {
      main: colors.success.main,
      light: colors.success.light,
      dark: colors.success.dark,
      contrastText: colors.success.contrastText,
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning.light,
      dark: colors.warning.dark,
      contrastText: colors.warning.contrastText,
    },
    error: {
      main: colors.error.main,
      light: colors.error.light,
      dark: colors.error.dark,
      contrastText: colors.error.contrastText,
    },
    info: {
      main: colors.info.main,
      light: colors.info.light,
      dark: colors.info.dark,
      contrastText: colors.info.contrastText,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.divider,
  },

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      color: colors.text.primary,
    },
    h2: {
      fontWeight: 700,
      color: colors.text.primary,
    },
    h3: {
      fontWeight: 600,
      color: colors.text.primary,
    },
    h4: {
      fontWeight: 600,
      color: colors.text.primary,
    },
    h5: {
      fontWeight: 600,
      color: colors.text.primary,
    },
    h6: {
      fontWeight: 600,
      color: colors.text.primary,
    },
    body1: {
      color: colors.text.primary,
    },
    body2: {
      color: colors.text.secondary,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        containedPrimary: {
          background: colors.primary.gradient,
          color: colors.primary.contrastText,
          '&:hover': {
            background: colors.primary.gradientHover,
          },
          '&:active': {
            background: colors.primary.gradientHover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        colorSuccess: {
          backgroundColor: colors.semantic.income.main,
          color: colors.semantic.income.contrastText,
        },
        colorError: {
          backgroundColor: colors.semantic.expense.main,
          color: colors.semantic.expense.contrastText,
        },
        colorDefault: {
          backgroundColor: colors.semantic.transfer.main,
          color: colors.semantic.transfer.contrastText,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
        colorPrimary: {
          backgroundColor: colors.divider,
        },
        barColorPrimary: {
          background: colors.primary.gradient,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: colors.text.primary,
          backgroundColor: colors.background.default,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.divider,
            },
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.04)',
          },
        },
      },
    },
  },

  shape: {
    borderRadius: 8,
  },
});
