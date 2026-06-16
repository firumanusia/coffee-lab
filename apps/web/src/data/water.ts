/**
 * SCA recommended water for coffee brewing.
 * Ref: SCA standard / thirdwavewater.eu
 *  - Total hardness: 17–85 ppm CaCO3 (target ~50–68 / "4 grams per gallon")
 *  - Alkalinity: ~40 ppm CaCO3
 *  - TDS: 75–250 ppm (target ~150 ppm)
 */
export const WATER_SCA = {
  totalHardness: { min: 17, target: 68, max: 85, unit: 'ppm CaCO₃' },
  alkalinity: { min: 0, target: 40, max: 75, unit: 'ppm CaCO₃' },
  tds: { min: 75, target: 150, max: 250, unit: 'ppm' },
}

/** Recommended brew temperature window. */
export const TEMP_RANGE = { min: 80, max: 100, default: 93 }

/**
 * Suggest a brew temperature from roast (Agtron). Lighter (higher Agtron)
 * → hotter water; darker (lower Agtron) → cooler.
 */
export function suggestTemp(agtron: number): number {
  // Agtron ~95 (ultra light) -> 96°C ; ~45 (dark) -> 86°C
  const t = 86 + ((agtron - 45) / (95 - 45)) * (96 - 86)
  return Math.round(Math.min(96, Math.max(85, t)))
}
