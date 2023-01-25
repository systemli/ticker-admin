import { Color } from '@mui/material'
import { alpha, PaletteColor } from '@mui/material/styles'

const grey: Color = {
  50: '',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  A100: '',
  A200: '',
  A400: '',
  A700: '',
}

const primary: PaletteColor = {
  //lighter: '#D1E9FC',
  light: '#76B0F1',
  main: '#2065D1',
  dark: '#103996',
  //darker: '#061B64',
  contrastText: '#fff',
}

const secondary: PaletteColor = {
  //lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  //darker: '#091A7A',
  contrastText: '#fff',
}

const info: PaletteColor = {
  //lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  //darker: '#04297A',
  contrastText: '#fff',
}

const success: PaletteColor = {
  //lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  //darker: '#08660D',
  contrastText: grey[800],
}

const warning: PaletteColor = {
  //lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  //darker: '#7A4F01',
  contrastText: grey[800],
}

const error: PaletteColor = {
  //lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  //darker: '#7A0C2E',
  contrastText: '#fff',
}

const palette = {
  common: { black: '#000', white: '#fff' },
  primary: primary,
  secondary: secondary,
  info: info,
  success: success,
  warning: warning,
  error: error,
  grey: grey,
  divider: alpha(grey[500], 0.24),
  text: {
    primary: grey[800],
    secondary: grey[600],
    disabled: grey[500],
  },
  background: {
    paper: '#fff',
    default: grey[100],
    neutral: grey[200],
  },
  action: {
    activatedOpacity: 0,
    active: grey[600],
    disabled: alpha(grey[500], 0.8),
    disabledBackground: alpha(grey[500], 0.24),
    disabledOpacity: 0.48,
    focus: alpha(grey[500], 0.24),
    focusOpacity: 0,
    hover: alpha(grey[500], 0.08),
    hoverOpacity: 0.08,
    selected: alpha(grey[500], 0.16),
    selectedOpacity: 0,
  },
}

export default palette
