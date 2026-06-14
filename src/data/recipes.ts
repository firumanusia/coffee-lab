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
