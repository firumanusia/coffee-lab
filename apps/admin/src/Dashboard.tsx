import { useEffect, useState } from 'react'
import { useGetList } from 'react-admin'
import { Link } from 'react-router-dom'
import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import StarRounded from '@mui/icons-material/StarRounded'
import { ResourceIcons } from './icons'
import { BRAND } from './theme'

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const p = Math.min(1, (now - start) / ms)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

const Tile = ({ children, sx, delay = 0 }: { children: React.ReactNode; sx?: object; delay?: number }) => (
  <Card className="bento bento-hover" style={{ animationDelay: `${delay}ms` }} sx={{ height: '100%', ...sx }}>
    <CardContent sx={{ height: '100%', p: 2.5, '&:last-child': { pb: 2.5 } }}>{children}</CardContent>
  </Card>
)

function StatTile({ name, total, color, delay }: { name: keyof typeof ResourceIcons; total: number; color: string; delay: number }) {
  const Icon = ResourceIcons[name]
  const n = useCountUp(total)
  return (
    <Box component={Link} to={`/${name}`} sx={{ textDecoration: 'none', gridColumn: 'span 1' }}>
      <Tile delay={delay}>
        <Stack spacing={1.2}>
          <Avatar variant="rounded" sx={{ bgcolor: `${color}1a`, color, width: 38, height: 38 }}>
            <Icon fontSize="small" />
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: 'text.primary' }}>{n}</Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', textTransform: 'capitalize' }}>{name}</Typography>
          </Box>
        </Stack>
      </Tile>
    </Box>
  )
}

export const Dashboard = () => {
  const beans = useGetList('beans', { pagination: { page: 1, perPage: 1 } })
  const grinders = useGetList('grinders', { pagination: { page: 1, perPage: 1 } })
  const drippers = useGetList('drippers', { pagination: { page: 1, perPage: 1 } })
  const filters = useGetList('filters', { pagination: { page: 1, perPage: 1 } })
  const recipes = useGetList('recipes', { pagination: { page: 1, perPage: 1 } })
  const waters = useGetList('waters', { pagination: { page: 1, perPage: 1 } })
  const users = useGetList('users', { pagination: { page: 1, perPage: 1 } })
  const logs = useGetList('logs', { pagination: { page: 1, perPage: 6 }, sort: { field: 'createdAt', order: 'DESC' } })

  const t = (r: ReturnType<typeof useGetList>) => r.total ?? 0
  const bars = [
    { name: 'beans', v: t(beans), c: BRAND.red },
    { name: 'grinders', v: t(grinders), c: BRAND.teal },
    { name: 'drippers', v: t(drippers), c: '#b8742f' },
    { name: 'filters', v: t(filters), c: '#7a5cd0' },
    { name: 'recipes', v: t(recipes), c: BRAND.redDeep },
    { name: 'waters', v: t(waters), c: '#2f8fb8' },
  ]
  const max = Math.max(1, ...bars.map((b) => b.v))
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setGrown(true), 80)
    return () => clearTimeout(id)
  }, [])

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        Welcome back ☕
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>Manage MENOOWEL's brewing catalog & users.</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gridAutoRows: { xs: 'auto', md: 'minmax(132px, auto)' }, gap: 2 }}>
        {/* Hero: catalog overview bar chart (2x2) */}
        <Box sx={{ gridColumn: { md: 'span 2' }, gridRow: { md: 'span 2' } }}>
          <Tile delay={0}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Catalog overview</Typography>
            <Stack spacing={1.4}>
              {bars.map((b) => (
                <Box key={b.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textTransform: 'capitalize' }}>{b.name}</Typography>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>{b.v}</Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: 99, bgcolor: 'action.hover', overflow: 'hidden' }}>
                    <Box className="bar-fill" sx={{ height: '100%', borderRadius: 99, bgcolor: b.c, width: grown ? `${(b.v / max) * 100}%` : '0%' }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Tile>
        </Box>

        {/* Stat tiles */}
        <StatTile name="beans" total={t(beans)} color={BRAND.red} delay={60} />
        <StatTile name="grinders" total={t(grinders)} color={BRAND.teal} delay={120} />
        <StatTile name="recipes" total={t(recipes)} color={BRAND.redDeep} delay={180} />
        <StatTile name="users" total={t(users)} color="#7a5cd0" delay={240} />

        {/* Recent brew logs (2x2) */}
        <Box sx={{ gridColumn: { md: 'span 2' }, gridRow: { md: 'span 2' } }}>
          <Tile delay={150}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Recent brew logs</Typography>
            {logs.total === 0 || !logs.data?.length ? (
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>No brews logged yet.</Typography>
            ) : (
              <Stack spacing={1}>
                {logs.data!.slice(0, 5).map((e: any) => (
                  <Box key={e.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                    <Box sx={{ display: 'flex', color: BRAND.red, minWidth: 78 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarRounded key={i} sx={{ fontSize: 15, opacity: i < (e.feedback?.rating ?? 0) ? 1 : 0.2 }} />
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{new Date(e.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Tile>
        </Box>

        <StatTile name="drippers" total={t(drippers)} color="#b8742f" delay={300} />
        <StatTile name="filters" total={t(filters)} color="#2f8fb8" delay={360} />

        {/* Quick add (2x1) */}
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <Tile delay={220}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Quick add</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(['beans', 'recipes', 'grinders', 'drippers'] as const).map((r) => {
                const Icon = ResourceIcons[r]
                return (
                  <Box
                    key={r}
                    component={Link}
                    to={`/${r}/create`}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.9, borderRadius: 2,
                      border: 1, borderColor: 'divider', textDecoration: 'none', color: 'text.primary', fontSize: 13, fontWeight: 600,
                      '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                    }}
                  >
                    <AddRounded sx={{ fontSize: 16 }} /> <Icon sx={{ fontSize: 16 }} /> {r}
                  </Box>
                )
              })}
            </Stack>
          </Tile>
        </Box>
      </Box>
    </Box>
  )
}
