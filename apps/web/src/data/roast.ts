import type { L } from './types'

export interface RoastBand {
  id: string
  name: L
  /** Agtron Gourmet scale midpoint (higher = lighter) */
  agtron: number
  range: [number, number]
  /** solubility multiplier for the extraction model */
  extraction: number
  color: string
}

/** Roast bands by Agtron (Gourmet/Commercial blend reference). */
export const ROAST_BANDS: RoastBand[] = [
  { id: 'ultra-light', name: { id: 'Ultra Light', en: 'Ultra Light' }, agtron: 95, range: [90, 100], extraction: 0.9, color: '#d8b98f' },
  { id: 'light', name: { id: 'Light', en: 'Light' }, agtron: 80, range: [75, 90], extraction: 0.95, color: '#c79a63' },
  { id: 'medium-light', name: { id: 'Medium Light', en: 'Medium Light' }, agtron: 68, range: [63, 75], extraction: 1.0, color: '#a96f40' },
  { id: 'medium', name: { id: 'Medium', en: 'Medium' }, agtron: 58, range: [53, 63], extraction: 1.05, color: '#8a5530' },
  { id: 'medium-dark', name: { id: 'Medium Dark', en: 'Medium Dark' }, agtron: 48, range: [43, 53], extraction: 1.1, color: '#5f3a2a' },
  { id: 'dark', name: { id: 'Dark', en: 'Dark' }, agtron: 35, range: [25, 43], extraction: 1.18, color: '#3a241a' },
]

export function roastFromAgtron(agtron: number): RoastBand {
  return (
    ROAST_BANDS.find((b) => agtron >= b.range[0] && agtron <= b.range[1]) ??
    (agtron > 95 ? ROAST_BANDS[0] : ROAST_BANDS[ROAST_BANDS.length - 1])
  )
}
