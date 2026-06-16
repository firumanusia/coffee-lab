/** SCA Brewing Control Chart geometry & verdicts. */

export const SCA = {
  // axes
  ey: { min: 14, max: 26 },
  tds: { min: 0.8, max: 1.6 },
  // ideal "gold cup" box
  idealEy: { min: 18, max: 22 },
  idealTds: { min: 1.15, max: 1.35 },
}

export type Strength = 'weak' | 'ideal' | 'strong'
export type Extraction = 'under' | 'ideal' | 'over'

export function strengthOf(tds: number): Strength {
  if (tds < SCA.idealTds.min) return 'weak'
  if (tds > SCA.idealTds.max) return 'strong'
  return 'ideal'
}

export function extractionOf(ey: number): Extraction {
  if (ey < SCA.idealEy.min) return 'under'
  if (ey > SCA.idealEy.max) return 'over'
  return 'ideal'
}

/** Brew ratio diagonals to draw on the chart (g coffee per L water-ish). */
export const RATIO_LINES = [
  { label: '1:14', value: 14 },
  { label: '1:16', value: 16 },
  { label: '1:18', value: 18 },
]
