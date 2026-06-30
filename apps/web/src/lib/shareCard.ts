// Renders a branded, shareable "brew recipe card" PNG from the current settings.
// Pure Canvas 2D — no dependencies. Portrait 1080x1350 (great for IG/WhatsApp/X).

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
  measured: boolean
  strength: string
  extraction: string
}

const W = 1080
const H = 1350
const PAD = 72

const C = {
  bg: '#161311',
  red: '#E84B3D',
  redDeep: '#D00600',
  teal: '#0bb3b3',
  text: '#f3efec',
  muted: '#a39c97',
  faint: '#6b6460',
  line: 'rgba(255,255,255,0.08)',
  tile: 'rgba(255,255,255,0.04)',
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export async function drawShareCard(d: ShareData): Promise<{ blob: Blob; url: string }> {
  // make sure the webfont is ready so the canvas uses Inter
  try {
    await (document as any).fonts?.ready
  } catch {
    /* ignore */
  }

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const font = (size: number, weight = 400) => `${weight} ${size}px Inter, system-ui, sans-serif`

  // ---- background + brand glows ----
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)
  const g1 = ctx.createRadialGradient(W - 80, 60, 0, W - 80, 60, 620)
  g1.addColorStop(0, 'rgba(232,75,61,0.28)')
  g1.addColorStop(1, 'rgba(232,75,61,0)')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, W, H)
  const g2 = ctx.createRadialGradient(40, H - 60, 0, 40, H - 60, 640)
  g2.addColorStop(0, 'rgba(6,148,148,0.26)')
  g2.addColorStop(1, 'rgba(6,148,148,0)')
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, W, H)

  ctx.textBaseline = 'alphabetic'

  // ---- header ----
  let y = PAD + 40
  ctx.textAlign = 'left'
  ctx.font = font(40, 800)
  ctx.fillStyle = C.red
  ctx.fillText('MENOOWEL', PAD, y)
  const mw = ctx.measureText('MENOOWEL').width
  ctx.font = font(20, 700)
  ctx.fillStyle = C.teal
  ctx.fillText('BrewLab Studio', PAD + mw + 16, y - 2)
  ctx.textAlign = 'right'
  ctx.font = font(24, 700)
  ctx.fillStyle = C.text
  ctx.fillText('menoowel.com', W - PAD, y)

  y += 30
  ctx.strokeStyle = C.line
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(PAD, y)
  ctx.lineTo(W - PAD, y)
  ctx.stroke()

  // ---- bean headline ----
  y += 76
  ctx.textAlign = 'left'
  ctx.font = font(18, 700)
  ctx.fillStyle = C.faint
  ctx.fillText('BREW RECIPE', PAD, y)
  y += 58
  ctx.font = font(56, 800)
  ctx.fillStyle = C.text
  ctx.fillText(d.variety || 'Custom brew', PAD, y, W - PAD * 2)
  y += 40
  ctx.font = font(26, 500)
  ctx.fillStyle = C.muted
  const loc = [d.origin, d.region].filter(Boolean).join(' · ')
  if (loc) ctx.fillText(loc, PAD, y, W - PAD * 2)
  y += 36
  ctx.font = font(22, 500)
  ctx.fillStyle = C.teal
  ctx.fillText([d.process, `${d.roastName} · Agtron ${d.agtron}`].filter(Boolean).join('  |  '), PAD, y, W - PAD * 2)

  // ---- spec rows ----
  y += 64
  const rows: [string, string][] = [
    ['Grinder', `${d.grinder}`],
    ['Grind', `${d.micron} µm${d.clicks ? ` · ${d.clicks}` : ''}`],
    ['Dripper', d.dripper],
    ['Filter', d.filter],
    ['Recipe', `${d.recipeName}${d.author && d.author !== '—' ? ` — ${d.author}` : ''}`],
  ]
  ctx.font = font(24)
  for (const [k, v] of rows) {
    ctx.textAlign = 'left'
    ctx.font = font(22, 600)
    ctx.fillStyle = C.faint
    ctx.fillText(k, PAD, y)
    ctx.textAlign = 'right'
    ctx.font = font(24, 600)
    ctx.fillStyle = C.text
    ctx.fillText(v, W - PAD, y, W - PAD * 2 - 180)
    y += 30
    ctx.strokeStyle = C.line
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD, y)
    ctx.lineTo(W - PAD, y)
    ctx.stroke()
    y += 28
  }

  // ---- dose / ratio / temp / water strip ----
  y += 8
  const strip = [
    ['Dose', `${d.dose} g`],
    ['Ratio', `1:${d.ratio}`],
    ['Water', `${Math.round(d.totalWater)} g`],
    ['Temp', `${d.tempC}°C`],
  ]
  const sw = (W - PAD * 2) / strip.length
  strip.forEach(([k, v], i) => {
    const cx = PAD + sw * i + sw / 2
    ctx.textAlign = 'center'
    ctx.font = font(34, 800)
    ctx.fillStyle = C.text
    ctx.fillText(v, cx, y)
    ctx.font = font(18, 600)
    ctx.fillStyle = C.faint
    ctx.fillText(k.toUpperCase(), cx, y + 28)
  })
  y += 66

  // ---- predicted result tiles ----
  y += 18
  const tiles = [
    ['YIELD', `${Math.round(d.yieldG)}g`, C.text],
    ['TDS', `${d.tds.toFixed(2)}%`, C.red],
    ['EY', `${d.ey.toFixed(1)}%`, C.teal],
  ] as const
  const tw = (W - PAD * 2 - 32) / 3
  const th = 170
  tiles.forEach(([k, v, col], i) => {
    const x = PAD + (tw + 16) * i
    ctx.fillStyle = C.tile
    roundRect(ctx, x, y, tw, th, 22)
    ctx.fill()
    ctx.strokeStyle = C.line
    ctx.lineWidth = 1.5
    roundRect(ctx, x, y, tw, th, 22)
    ctx.stroke()
    ctx.textAlign = 'center'
    ctx.font = font(54, 800)
    ctx.fillStyle = col
    ctx.fillText(v, x + tw / 2, y + 96)
    ctx.font = font(20, 700)
    ctx.fillStyle = C.muted
    ctx.fillText(k, x + tw / 2, y + 132)
  })
  y += th + 18
  ctx.textAlign = 'center'
  ctx.font = font(22, 600)
  ctx.fillStyle = C.muted
  ctx.fillText(
    `${d.measured ? 'Measured' : 'Predicted'} · ${d.strength} strength · ${d.extraction} extraction`,
    W / 2,
    y + 6,
  )

  // ---- pours mini timeline ----
  if (d.pours.length) {
    y += 54
    ctx.textAlign = 'left'
    ctx.font = font(18, 700)
    ctx.fillStyle = C.faint
    ctx.fillText('POURS', PAD, y)
    y += 26
    const last = Math.max(...d.pours.map((p) => p.at), 1)
    const lineY = y + 14
    ctx.strokeStyle = C.line
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(PAD, lineY)
    ctx.lineTo(W - PAD, lineY)
    ctx.stroke()
    let cum = 0
    d.pours.forEach((p) => {
      cum += p.grams
      const x = PAD + (p.at / last) * (W - PAD * 2)
      ctx.fillStyle = C.red
      ctx.beginPath()
      ctx.arc(x, lineY, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.textAlign = 'center'
      ctx.font = font(17, 700)
      ctx.fillStyle = C.text
      ctx.fillText(fmtTime(p.at), x, lineY - 22)
      ctx.font = font(15, 500)
      ctx.fillStyle = C.muted
      ctx.fillText(`${Math.round(cum)}g`, x, lineY + 34)
    })
    y = lineY + 40
  }

  // ---- footer CTA ----
  const fy = H - 96
  ctx.fillStyle = 'rgba(232,75,61,0.12)'
  roundRect(ctx, PAD, fy - 40, W - PAD * 2, 78, 20)
  ctx.fill()
  ctx.textAlign = 'center'
  ctx.font = font(28, 700)
  ctx.fillStyle = C.text
  ctx.fillText('Dial in your own pour-over  →  menoowel.com', W / 2, fy + 8)

  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'))
  return { blob, url: canvas.toDataURL('image/png') }
}
