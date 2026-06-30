// Renders a branded, shareable "brew recipe card" PNG from the current settings.
// Pure Canvas 2D — no dependencies. Portrait 1080x1500. Theme- and language-aware.

export interface ShareData {
  variety: string
  origin: string
  region: string
  process: string
  roastName: string
  agtron: number
  grinder: string
  micron: number
  clicks: string
  dripper: string
  filter: string
  recipeName: string
  author: string
  dose: number
  ratio: number
  totalWater: number
  tempC: number
  pours: { at: number; grams: number }[]
  yieldG: number
  tds: number
  ey: number
}

export interface ShareLabels {
  brewRecipe: string
  grinder: string
  grind: string
  dripper: string
  filter: string
  recipe: string
  dose: string
  ratio: string
  water: string
  temp: string
  caption: string
  cta: string
}

const W = 1080
const H = 1500
const M = 80
const CW = W - 2 * M

const DARK = {
  bg: '#161311',
  red: '#E84B3D',
  teal: '#0bb3b3',
  text: '#f3efec',
  muted: '#a39c97',
  faint: '#78726d',
  line: 'rgba(255,255,255,0.11)',
  hair: 'rgba(255,255,255,0.06)',
  card: 'rgba(255,255,255,0.04)',
  cardEdge: 'rgba(255,255,255,0.09)',
  tile: 'rgba(255,255,255,0.05)',
  glowRed: 'rgba(232,75,61,0.30)',
  glowTeal: 'rgba(6,148,148,0.26)',
  footerFill: 'rgba(232,75,61,0.13)',
  footerEdge: 'rgba(232,75,61,0.35)',
}
const LIGHT = {
  bg: '#faf7f4',
  red: '#E84B3D',
  teal: '#069494',
  text: '#2b2422',
  muted: '#6f6a67',
  faint: '#9b938d',
  line: 'rgba(43,36,34,0.13)',
  hair: 'rgba(43,36,34,0.07)',
  card: 'rgba(43,36,34,0.035)',
  cardEdge: 'rgba(43,36,34,0.11)',
  tile: 'rgba(43,36,34,0.045)',
  glowRed: 'rgba(232,75,61,0.14)',
  glowTeal: 'rgba(6,148,148,0.12)',
  footerFill: 'rgba(232,75,61,0.10)',
  footerEdge: 'rgba(232,75,61,0.30)',
}

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export async function drawShareCard(
  d: ShareData,
  opts: { theme: 'light' | 'dark'; labels: ShareLabels },
): Promise<{ blob: Blob; url: string }> {
  try {
    await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
  } catch {
    /* ignore */
  }
  const C = opts.theme === 'light' ? LIGHT : DARK
  const { labels: T } = opts

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const font = (size: number, weight = 400) => `${weight} ${size}px Inter, system-ui, sans-serif`

  type Align = CanvasTextAlign
  type Base = CanvasTextBaseline
  const text = (s: string, x: number, y: number, f: string, color: string, align: Align = 'left', base: Base = 'alphabetic', maxw?: number) => {
    ctx.font = f
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = base
    ctx.fillText(s, x, y, maxw)
  }
  const line = (x0: number, y0: number, x1: number, y1: number, color: string, w = 1) => {
    ctx.strokeStyle = color
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }
  const panel = (x: number, y: number, w: number, h: number, r: number, fill: string, edge?: string) => {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    ctx.fillStyle = fill
    ctx.fill()
    if (edge) {
      ctx.strokeStyle = edge
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, r)
      ctx.stroke()
    }
  }

  // ---- background + brand glows ----
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)
  const glow = (cx: number, cy: number, r: number, c0: string) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    g.addColorStop(0, c0)
    g.addColorStop(1, c0.replace(/[\d.]+\)$/, '0)'))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }
  glow(W - 40, 30, 620, C.glowRed)
  glow(20, H - 30, 660, C.glowTeal)

  let y = M

  // ---- header ----
  text('MENOOWEL', M, y, font(40, 800), C.red, 'left', 'top')
  ctx.font = font(40, 800)
  const mw = ctx.measureText('MENOOWEL').width
  text('BrewLab Studio', M + mw + 18, y + 12, font(20, 700), C.teal, 'left', 'top')
  text('menoowel.com', W - M, y + 8, font(24, 700), C.text, 'right', 'top')
  y += 64
  line(M, y, W - M, y, C.line, 2)
  y += 48

  // ---- hero ----
  text(T.brewRecipe, M, y, font(18, 800), C.faint, 'left', 'top')
  y += 44
  text(d.variety || 'Custom', M, y, font(58, 800), C.text, 'left', 'top', CW)
  y += 74
  const loc = [d.origin, d.region].filter(Boolean).join('  ·  ')
  text(loc || '—', M, y, font(27, 400), C.muted, 'left', 'top', CW)
  y += 40
  const pr = [d.process, `${d.roastName} · Agtron ${d.agtron}`].filter(Boolean).join('    •    ')
  text(pr, M, y, font(22, 700), C.teal, 'left', 'top', CW)
  y += 58

  // ---- spec card ----
  const rows: [string, string][] = [
    [T.grinder, d.grinder],
    [T.grind, `${d.micron} µm${d.clicks ? ` · ${d.clicks}` : ''}`],
    [T.dripper, d.dripper],
    [T.filter, d.filter],
    [T.recipe, `${d.recipeName}${d.author && d.author !== '—' ? ` — ${d.author}` : ''}`],
  ]
  const rowH = 68
  const padIn = 28
  const ch = padIn * 2 + rowH * rows.length
  panel(M, y, CW, ch, 24, C.card, C.cardEdge)
  let ry = y + padIn + rowH / 2
  rows.forEach(([k, v], i) => {
    text(k, M + 32, ry, font(23, 600), C.faint, 'left', 'middle')
    text(v, W - M - 32, ry, font(24, 600), C.text, 'right', 'middle', CW - 320)
    if (i < rows.length - 1) line(M + 32, ry + rowH / 2, W - M - 32, ry + rowH / 2, C.hair, 1)
    ry += rowH
  })
  y += ch + 40

  // ---- stat strip ----
  const strip: [string, string][] = [
    [T.dose, `${d.dose} g`],
    [T.ratio, `1:${d.ratio}`],
    [T.water, `${Math.round(d.totalWater)} g`],
    [T.temp, `${d.tempC}°C`],
  ]
  const sh = 120
  panel(M, y, CW, sh, 24, C.card, C.cardEdge)
  const sw = CW / strip.length
  strip.forEach(([k, v], i) => {
    const cx = M + sw * i + sw / 2
    text(v, cx, y + 44, font(36, 800), C.text, 'center', 'middle')
    text(k, cx, y + 84, font(18, 700), C.faint, 'center', 'middle')
    if (i > 0) line(M + sw * i, y + 24, M + sw * i, y + sh - 24, C.hair, 1)
  })
  y += sh + 40

  // ---- result tiles ----
  const tiles: [string, string, string][] = [
    ['YIELD', `${Math.round(d.yieldG)}g`, C.text],
    ['TDS', `${d.tds.toFixed(2)}%`, C.red],
    ['EY', `${d.ey.toFixed(1)}%`, C.teal],
  ]
  const gap = 20
  const tw = (CW - gap * 2) / 3
  const th = 180
  tiles.forEach(([k, v, col], i) => {
    const x = M + (tw + gap) * i
    panel(x, y, tw, th, 22, C.tile, C.cardEdge)
    text(v, x + tw / 2, y + th / 2 - 12, font(56, 800), col, 'center', 'middle')
    text(k, x + tw / 2, y + th - 40, font(20, 700), C.muted, 'center', 'middle')
  })
  y += th + 30
  text(T.caption, W / 2, y, font(22, 600), C.muted, 'center', 'top', CW)
  y += 52

  // ---- pours timeline ----
  if (d.pours.length) {
    y += 24
    const last = Math.max(...d.pours.map((p) => p.at), 1)
    const ly = y
    line(M, ly, W - M, ly, C.line, 4)
    let cum = 0
    d.pours.forEach((p) => {
      cum += p.grams
      const x = d.pours.length === 1 ? M + CW / 2 : M + (p.at / last) * CW
      ctx.fillStyle = C.red
      ctx.beginPath()
      ctx.arc(x, ly, 10, 0, Math.PI * 2)
      ctx.fill()
      text(fmtTime(p.at), x, ly - 26, font(18, 700), C.text, 'center', 'bottom')
      text(`${Math.round(cum)}g`, x, ly + 18, font(16, 400), C.muted, 'center', 'top')
    })
    y = ly + 44
  } else {
    y += 24
  }

  // ---- footer CTA ----
  panel(M, y, CW, 86, 20, C.footerFill, C.footerEdge)
  text(T.cta, W / 2, y + 43, font(28, 700), C.text, 'center', 'middle')

  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'))
  return { blob, url: canvas.toDataURL('image/png') }
}
