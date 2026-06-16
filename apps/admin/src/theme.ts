import type { RaThemeOptions } from 'react-admin'

// MENOOWEL brand palette (matches the web app): red primary, teal secondary.
const brand = {
  red: '#E84B3D',
  redDeep: '#D00600',
  teal: '#069494',
  tealLight: '#0bb3b3',
}

const shared = {
  shape: { borderRadius: 10 },
  typography: { fontFamily: 'Inter, system-ui, sans-serif', fontWeightBold: 800 },
  components: {
    MuiAppBar: {
      defaultProps: { color: 'primary' as const },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
}

export const lightTheme: RaThemeOptions = {
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: brand.red, dark: brand.redDeep, contrastText: '#ffffff' },
    secondary: { main: brand.teal, light: brand.tealLight, contrastText: '#ffffff' },
    background: { default: '#faf7f4', paper: '#ffffff' },
    text: { primary: '#2b2422' },
  },
}

export const darkTheme: RaThemeOptions = {
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: brand.red, dark: brand.redDeep, contrastText: '#ffffff' },
    secondary: { main: brand.tealLight, contrastText: '#06201f' },
    background: { default: '#171717', paper: '#1c1a19' },
    text: { primary: '#ece8e5' },
  },
}
