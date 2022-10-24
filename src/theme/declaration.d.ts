import { CustomShadows } from './customShadows'

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows
  }

  interface ThemeOptions {
    customShadows: CustomShadows
  }

  interface TypeBackground {
    neutral: string
  }
}
