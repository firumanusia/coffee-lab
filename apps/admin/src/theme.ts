import type { RaThemeOptions } from 'react-admin'

const brand = { red: '#E84B3D', redDeep: '#D00600', teal: '#069494', tealLight: '#0bb3b3' }

const shared: RaThemeOptions = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  sidebar: { width: 244, closedWidth: 60 },
}

const components = (mode: 'light' | 'dark') => {
  const border = mode === 'light' ? '#ececea' : '#2a2725'
  const muted = mode === 'light' ? '#6f6a67' : '#9d9794'
  return {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 10 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${border}`,
          boxShadow: mode === 'light' ? '0 1px 2px rgba(43,36,34,0.04)' : 'none',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? '#1c1a19' : '#ece8e5',
          backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.86)' : 'rgba(20,19,18,0.86)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'none',
          borderBottom: `1px solid ${border}`,
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 10px',
          paddingTop: 9,
          paddingBottom: 9,
          color: muted,
          '&:hover': { backgroundColor: mode === 'light' ? '#f4f2f0' : '#221f1e' },
          '&.RaMenuItemLink-active': {
            backgroundColor: mode === 'light' ? 'rgba(232,75,61,0.10)' : 'rgba(232,75,61,0.16)',
            color: brand.red,
            fontWeight: 700,
            '& .MuiSvgIcon-root': { color: brand.red },
          },
        },
      },
    },
    RaSidebar: {
      styleOverrides: {
        root: { '& .RaSidebar-fixed': { borderRight: `1px solid ${border}` } },
      },
    },
    RaLayout: { styleOverrides: { root: { '& .RaLayout-content': { padding: 24, backgroundColor: 'transparent' } } } },
    RaDatagrid: {
      styleOverrides: {
        root: {
          '& .RaDatagrid-headerCell': { fontWeight: 700, color: muted },
          '& .RaDatagrid-rowCell': { paddingTop: 10, paddingBottom: 10 },
        },
      },
    },
  }
}

export const lightTheme: RaThemeOptions = {
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: brand.red, dark: brand.redDeep, contrastText: '#fff' },
    secondary: { main: brand.teal, light: brand.tealLight, contrastText: '#fff' },
    background: { default: '#faf9f8', paper: '#ffffff' },
    text: { primary: '#1c1a19', secondary: '#6f6a67' },
    divider: '#ececea',
  },
  components: components('light') as RaThemeOptions['components'],
}

export const darkTheme: RaThemeOptions = {
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: brand.red, dark: brand.redDeep, contrastText: '#fff' },
    secondary: { main: brand.tealLight, contrastText: '#06201f' },
    background: { default: '#141312', paper: '#1c1a19' },
    text: { primary: '#ece8e5', secondary: '#9d9794' },
    divider: '#2a2725',
  },
  components: components('dark') as RaThemeOptions['components'],
}

export const BRAND = brand
