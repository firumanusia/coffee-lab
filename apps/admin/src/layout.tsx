import type { ReactNode } from 'react'
import { AppBar, Layout, Menu, TitlePortal, ToggleThemeButton, UserMenu, Logout, useResourceDefinitions } from 'react-admin'
import { Box, Breadcrumbs, IconButton, ListSubheader, Tooltip, Typography, useTheme } from '@mui/material'
import OpenInNew from '@mui/icons-material/OpenInNew'
import NavigateNext from '@mui/icons-material/NavigateNext'
import { Link, useLocation } from 'react-router-dom'

const CATALOG = ['beans', 'grinders', 'drippers', 'filters', 'waters', 'recipes', 'processes']
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function Brand() {
  const theme = useTheme()
  const src = theme.palette.mode === 'light' ? '/img/Logo Light v2.png' : '/img/Logo Dark v2.png'
  return (
    <Box sx={{ px: 2, py: 2.5, display: 'flex', justifyContent: 'center' }}>
      <img src={src} alt="MENOOWEL" style={{ height: 30, width: 'auto' }} />
    </Box>
  )
}

function sub(text: string) {
  return (
    <ListSubheader
      key={text}
      disableSticky
      sx={{ bgcolor: 'transparent', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary', lineHeight: '32px', px: 3, mt: 1 }}
    >
      {text}
    </ListSubheader>
  )
}

export const MenuShell = () => (
  <Menu>
    <Brand />
    <Menu.DashboardItem />
    {sub('Catalog')}
    {CATALOG.map((name) => (
      <Menu.ResourceItem key={name} name={name} />
    ))}
    {sub('Inbox')}
    <Menu.ResourceItem name="feedback" />
    {sub('Access')}
    <Menu.ResourceItem name="users" />
    <Box sx={{ flex: 1 }} />
    <Box sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
      <Typography
        component="a"
        href="https://menoowel.com"
        target="_blank"
        sx={{ fontSize: 12, color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
      >
        View live site ↗
      </Typography>
    </Box>
  </Menu>
)

function Breadcrumb() {
  const { pathname } = useLocation()
  const defs = useResourceDefinitions()
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) {
    return <Typography sx={{ fontWeight: 700 }}>Dashboard</Typography>
  }
  const resource = parts[0]
  const known = !!defs[resource]
  const action = parts[1] === 'create' ? 'New' : parts[1] ? 'Edit' : null
  return (
    <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16 }} />} sx={{ fontSize: 14 }}>
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>
        Home
      </Link>
      {action ? (
        <Link to={`/${resource}`} style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>
          {known ? label(resource) : resource}
        </Link>
      ) : (
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{known ? label(resource) : resource}</Typography>
      )}
      {action && <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{action}</Typography>}
    </Breadcrumbs>
  )
}

const AppBarShell = () => (
  <AppBar color="inherit" userMenu={<UserMenu><Logout /></UserMenu>}>
    <TitlePortal sx={{ display: 'none' }} />
    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
      <Breadcrumb />
    </Box>
    <Tooltip title="View live site">
      <IconButton
        size="small"
        href="https://menoowel.com"
        target="_blank"
        rel="noopener"
        color="inherit"
        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
      >
        <OpenInNew fontSize="small" />
      </IconButton>
    </Tooltip>
    <ToggleThemeButton />
  </AppBar>
)

export const LayoutShell = ({ children }: { children: ReactNode }) => (
  <Layout appBar={AppBarShell} menu={MenuShell}>
    {children}
  </Layout>
)
