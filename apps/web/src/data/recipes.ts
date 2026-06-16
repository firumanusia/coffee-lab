import type { L } from './types'

export type PourStyle = 'center' | 'spiral' | 'pulse' | 'aggressive' | 'gentle' | 'bloom'

export interface PourStep {
  /** seconds from start when this pour begins */
  at: number
  /** fraction of total water added in this pour (all steps sum to 1) */
  frac: number
  style: PourStyle
  note?: L
}

export interface Recipe {
  id: string
  name: string
  author: string
  /** default dose (g) and ratio (1:N) */
  dose: number
  ratio: number
  /** suggested water temp (°C) and target roast Agtron */
  tempC: number
  agtron: number
  /** pours locked (champion) or editable (custom) */
  fixed: boolean
  pours: PourStep[]
  description: L
}

const even = (n: number): number => 1 / n

/** Built-in champion / influencer recipes. */
export const RECIPES: Recipe[] = [
  {
    id: 'kasuya-46',
    name: '4:6 Method',
    author: 'Tetsu Kasuya',
    dose: 20,
    ratio: 15,
    tempC: 92,
    agtron: 70,
    fixed: true,
    pours: [
      { at: 0, frac: 0.2, style: 'center', note: { id: 'Pour 1 — atur asiditas', en: 'Pour 1 — sets acidity' } },
      { at: 45, frac: 0.2, style: 'spiral', note: { id: 'Pour 2 — atur manis', en: 'Pour 2 — sets sweetness' } },
      { at: 90, frac: 0.2, style: 'spiral', note: { id: 'Pour 3 — kekuatan', en: 'Pour 3 — strength' } },
      { at: 130, frac: 0.2, style: 'spiral' },
      { at: 165, frac: 0.2, style: 'spiral' },
    ],
    description: { id: 'Juara dunia 2016. 40% pertama mengatur rasa, 60% sisanya mengatur kekuatan.', en: '2016 world champion. First 40% sets taste, last 60% sets strength.' },
  },
  {
    id: 'hoffmann-v60',
    name: 'Ultimate V60 (1 cup)',
    author: 'James Hoffmann',
    dose: 15,
    ratio: 16.7,
    tempC: 95,
    agtron: 75,
    fixed: true,
    pours: [
      { at: 0, frac: 0.12, style: 'bloom', note: { id: 'Bloom 2x berat kopi, aduk/swirl', en: 'Bloom 2x coffee weight, swirl' } },
      { at: 45, frac: 0.48, style: 'spiral', note: { id: 'Naik ke 60% total', en: 'Up to 60% total' } },
      { at: 75, frac: 0.4, style: 'spiral', note: { id: 'Naik ke 100%, lalu swirl', en: 'Up to 100%, then swirl' } },
    ],
    description: { id: 'Resep V60 satu cangkir paling populer. Swirl di akhir untuk bed rata.', en: 'The most popular single-cup V60. Swirl at the end to flatten the bed.' },
  },
  {
    id: 'hendrick-hybrid',
    name: 'High-Extraction V60',
    author: 'Lance Hendrick',
    dose: 18,
    ratio: 16.7,
    tempC: 96,
    agtron: 78,
    fixed: true,
    pours: [
      { at: 0, frac: 0.18, style: 'bloom', note: { id: 'Bloom kuat + swirl agresif', en: 'Strong bloom + aggressive swirl' } },
      { at: 45, frac: 0.42, style: 'aggressive', note: { id: 'Pour tinggi & agitatif', en: 'High, agitating pour' } },
      { at: 90, frac: 0.4, style: 'aggressive', note: { id: 'Pour akhir, swirl', en: 'Final pour, swirl' } },
    ],
    description: { id: 'Pendekatan ekstraksi tinggi: agitasi & swirl untuk roast terang.', en: 'High-extraction approach: agitation & swirl for light roasts.' },
  },
  {
    id: 'winton-triangle',
    name: 'Triangle (pulse)',
    author: 'Matt Winton',
    dose: 20,
    ratio: 15,
    tempC: 92,
    agtron: 72,
    fixed: true,
    pours: [
      { at: 0, frac: even(6), style: 'bloom' },
      { at: 40, frac: even(6), style: 'pulse' },
      { at: 75, frac: even(6), style: 'pulse' },
      { at: 110, frac: even(6), style: 'pulse' },
      { at: 145, frac: even(6), style: 'pulse' },
      { at: 180, frac: even(6), style: 'pulse' },
    ],
    description: { id: 'Banyak pulse kecil yang merata untuk konsistensi & manis.', en: 'Many small even pulses for consistency & sweetness.' },
  },
  {
    id: 'wibawa-clean',
    name: 'Clean & Sweet V60',
    author: 'Ryan Wibawa',
    dose: 15,
    ratio: 16.7,
    tempC: 93,
    agtron: 73,
    fixed: true,
    pours: [
      { at: 0, frac: 0.18, style: 'bloom', note: { id: 'Bloom 45g', en: 'Bloom 45g' } },
      { at: 40, frac: 0.22, style: 'gentle' },
      { at: 70, frac: 0.2, style: 'gentle' },
      { at: 100, frac: 0.2, style: 'gentle' },
      { at: 130, frac: 0.2, style: 'gentle' },
    ],
    description: { id: 'Tuangan lembut bertahap untuk cangkir bersih & manis.', en: 'Gentle staged pours for a clean, sweet cup.' },
  },
  {
    id: 'rao-v60',
    name: 'V60 (single pour + stir)',
    author: 'Scott Rao',
    dose: 22,
    ratio: 16.5,
    tempC: 96,
    agtron: 72,
    fixed: true,
    pours: [
      { at: 0, frac: 0.14, style: 'bloom', note: { id: 'Bloom + aduk (Rao spin)', en: 'Bloom + stir (Rao spin)' } },
      { at: 45, frac: 0.86, style: 'aggressive', note: { id: 'Satu tuangan kontinu, lalu spin', en: 'One continuous pour, then spin' } },
    ],
    description: { id: 'Bloom diaduk, satu tuangan besar, spin di akhir untuk bed rata.', en: 'Stirred bloom, one big pour, spin at the end to flatten the bed.' },
  },
  {
    id: 'wendelboe-v60',
    name: 'Nordic V60',
    author: 'Tim Wendelboe',
    dose: 15,
    ratio: 16.7,
    tempC: 96,
    agtron: 80,
    fixed: true,
    pours: [
      { at: 0, frac: 0.16, style: 'bloom', note: { id: 'Bloom 40g, 30–45 detik', en: 'Bloom 40g, 30–45s' } },
      { at: 40, frac: 0.42, style: 'spiral' },
      { at: 80, frac: 0.42, style: 'spiral', note: { id: 'Roast terang, suhu tinggi', en: 'Light roast, high temp' } },
    ],
    description: { id: 'Gaya Nordic untuk roast sangat terang: suhu tinggi, tuangan stabil.', en: 'Nordic style for very light roasts: high temp, steady pours.' },
  },
  {
    id: 'onyx-v60',
    name: 'V60 (Onyx)',
    author: 'Onyx Coffee Lab',
    dose: 22,
    ratio: 15.9,
    tempC: 95,
    agtron: 74,
    fixed: true,
    pours: [
      { at: 0, frac: 0.17, style: 'bloom', note: { id: 'Bloom 60g, swirl', en: 'Bloom 60g, swirl' } },
      { at: 45, frac: 0.31, style: 'spiral' },
      { at: 80, frac: 0.26, style: 'spiral' },
      { at: 115, frac: 0.26, style: 'spiral' },
    ],
    description: { id: 'Resep V60 kompetisi Onyx — bertahap, manis & jernih.', en: 'Onyx competition V60 — staged, sweet & clear.' },
  },
  {
    id: 'kalita-flat',
    name: 'Kalita Wave',
    author: 'Flat-bottom classic',
    dose: 21,
    ratio: 16,
    tempC: 93,
    agtron: 68,
    fixed: true,
    pours: [
      { at: 0, frac: 0.13, style: 'bloom', note: { id: 'Bloom 2x, jaga bed rata', en: 'Bloom 2x, keep bed flat' } },
      { at: 40, frac: 0.29, style: 'pulse' },
      { at: 75, frac: 0.29, style: 'pulse' },
      { at: 110, frac: 0.29, style: 'pulse', note: { id: 'Tuang ke tengah, hindari dinding', en: 'Pour center, avoid walls' } },
    ],
    description: { id: 'Pulse merata untuk flat-bottom — body manis & seimbang.', en: 'Even pulses for flat-bottom — sweet, balanced body.' },
  },
  {
    id: 'kasuya-46-sweet',
    name: '4:6 Sweet & Strong',
    author: 'Tetsu Kasuya',
    dose: 20,
    ratio: 15,
    tempC: 91,
    agtron: 60,
    fixed: true,
    pours: [
      { at: 0, frac: 0.1, style: 'center', note: { id: 'Pour kecil → lebih manis', en: 'Small pour → sweeter' } },
      { at: 45, frac: 0.3, style: 'spiral', note: { id: 'Pour besar', en: 'Larger pour' } },
      { at: 90, frac: 0.2, style: 'spiral' },
      { at: 130, frac: 0.2, style: 'spiral' },
      { at: 165, frac: 0.2, style: 'spiral' },
    ],
    description: { id: 'Varian 4:6 untuk lebih manis & body kuat (cocok roast medium).', en: '4:6 variant for sweeter, stronger body (suits medium roast).' },
  },
  {
    id: 'custom-basic',
    name: 'Custom (3 pours)',
    author: '—',
    dose: 18,
    ratio: 16,
    tempC: 93,
    agtron: 70,
    fixed: false,
    pours: [
      { at: 0, frac: 0.2, style: 'bloom' },
      { at: 45, frac: 0.4, style: 'spiral' },
      { at: 90, frac: 0.4, style: 'spiral' },
    ],
    description: { id: 'Titik awal yang bisa kamu ubah sepenuhnya.', en: 'A fully editable starting point.' },
  },
]

export const POUR_STYLES: { id: PourStyle; label: L }[] = [
  { id: 'bloom', label: { id: 'Bloom', en: 'Bloom' } },
  { id: 'center', label: { id: 'Tengah', en: 'Center' } },
  { id: 'spiral', label: { id: 'Spiral', en: 'Spiral' } },
  { id: 'pulse', label: { id: 'Pulse', en: 'Pulse' } },
  { id: 'gentle', label: { id: 'Lembut', en: 'Gentle' } },
  { id: 'aggressive', label: { id: 'Agresif', en: 'Aggressive' } },
]
