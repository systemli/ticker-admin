import { CssBaseline, ThemeProvider as MUIThemeProvider, StyledEngineProvider, alpha, createTheme } from '@mui/material'
import { FC, ReactNode } from 'react'
import GlobalStyles from './GlobalStyles'
import customShadows from './customShadows'
import palette from './palette'
import shadows from './shadows'
import typography from './typography'

const theme = createTheme({
  palette: palette,
  shadows: shadows,
  typography: typography,
  customShadows: customShadows,
})
theme.components = {
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        boxShadow: customShadows.z20,
      },
    },
  },
  MuiBackdrop: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(palette.grey[800], 0.8),
      },
      invisible: {
        background: 'transparent',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          boxShadow: 'none',
        },
      },
      sizeLarge: {
        height: 48,
      },
      containedInherit: {
        color: palette.grey[800],
        boxShadow: customShadows.z8,
        '&:hover': {
          backgroundColor: palette.grey[400],
        },
      },
      containedPrimary: {
        boxShadow: customShadows.primary,
      },
      containedSecondary: {
        boxShadow: customShadows.secondary,
      },
      outlinedInherit: {
        border: `1px solid ${alpha(palette.grey[500], 0.32)}`,
        '&:hover': {
          backgroundColor: palette.action.hover,
        },
      },
      textInherit: {
        '&:hover': {
          backgroundColor: palette.action.hover,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow: theme.customShadows.card,
        borderRadius: Number(theme.shape.borderRadius) * 2,
        position: 'relative',
        zIndex: 0, // Fix Safari overflow: hidden with border radius
      },
    },
  },
  MuiCardHeader: {
    defaultProps: {
      titleTypographyProps: { variant: 'h6' },
      subheaderTypographyProps: { variant: 'body2' },
    },
    styleOverrides: {
      root: {
        padding: theme.spacing(3, 3, 0),
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: theme.spacing(3),
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        '&.Mui-disabled': {
          '& svg': { color: palette.text.disabled },
        },
      },
      input: {
        '&::placeholder': {
          opacity: 1,
          color: palette.text.disabled,
        },
      },
    },
  },
  MuiInput: {
    styleOverrides: {
      underline: {
        '&:before': {
          borderBottomColor: alpha(palette.grey[500], 0.56),
        },
      },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(palette.grey[500], 0.12),
        '&:hover': {
          backgroundColor: alpha(palette.grey[500], 0.16),
        },
        '&.Mui-focused': {
          backgroundColor: palette.action.focus,
        },
        '&.Mui-disabled': {
          backgroundColor: palette.action.disabledBackground,
        },
      },
      underline: {
        '&:before': {
          borderBottomColor: alpha(palette.grey[500], 0.56),
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: alpha(palette.grey[500], 0.32),
        },
        '&.Mui-disabled': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.action.disabledBackground,
          },
        },
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        color: palette.text.secondary,
        backgroundColor: palette.background.neutral,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: palette.grey[800],
      },
      arrow: {
        color: palette.grey[800],
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      paragraph: {
        marginBottom: theme.spacing(2),
      },
      gutterBottom: {
        marginBottom: theme.spacing(1),
      },
    },
  },
}

interface Props {
  children: ReactNode
}

const ThemeProvider: FC<Props> = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  )
}

export default ThemeProvider
