import type { L } from './types'

export interface GrindBand {
  id: string
  name: L
  /** micron range */
  range: [number, number]
  methods: L
}

/**
 * Grind size chart (micron) by brew method.
 * Ref: honestcoffeeguide.com/coffee-grind-size-chart
 */
export const GRIND_BANDS: GrindBand[] = [
  { id: 'extra-fine', name: { id: 'Extra Halus', en: 'Extra Fine' }, range: [100, 300], methods: { id: 'Turkish', en: 'Turkish' } },
  { id: 'fine', name: { id: 'Halus', en: 'Fine' }, range: [300, 500], methods: { id: 'Espresso, Moka pot', en: 'Espresso, Moka pot' } },
  { id: 'medium-fine', name: { id: 'Medium Halus', en: 'Medium Fine' }, range: [500, 700], methods: { id: 'V60, Aeropress, dripper conical', en: 'V60, Aeropress, conical drippers' } },
  { id: 'medium', name: { id: 'Medium', en: 'Medium' }, range: [700, 900], methods: { id: 'Kalita, flat-bottom, siphon', en: 'Kalita, flat-bottom, siphon' } },
  { id: 'medium-coarse', name: { id: 'Medium Kasar', en: 'Medium Coarse' }, range: [900, 1100], methods: { id: 'Chemex, batch brew', en: 'Chemex, batch brew' } },
  { id: 'coarse', name: { id: 'Kasar', en: 'Coarse' }, range: [1100, 1300], methods: { id: 'French press', en: 'French press' } },
  { id: 'extra-coarse', name: { id: 'Extra Kasar', en: 'Extra Coarse' }, range: [1300, 1600], methods: { id: 'Cold brew', en: 'Cold brew' } },
]

export const MICRON_RANGE = { min: 300, max: 1300, default: 650 }

export function grindBandFor(micron: number): GrindBand {
  return (
    GRIND_BANDS.find((b) => micron >= b.range[0] && micron < b.range[1]) ??
    (micron < GRIND_BANDS[0].range[0] ? GRIND_BANDS[0] : GRIND_BANDS[GRIND_BANDS.length - 1])
  )
}
