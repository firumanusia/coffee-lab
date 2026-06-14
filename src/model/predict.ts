import { DRIPPERS } from '../data/drippers'
import { FILTERS } from '../data/filters'
import { PROCESSES } from '../data/processes'
import { roastFromAgtron } from '../data/roast'
import type { BrewConfig } from '../store/types'

export interface Prediction {
  totalWater: number
  beverageMass: number
  ey: number
  tds: number
  brewTimeSec: number
  flowRate: number
  source: 'predicted' | 'measured'
  hints: { id: string; en: string }[]
}

const ABSORPTION = 2.0 // g water retained per g coffee

/**
 * Transparent heuristic extraction model. NOT lab-accurate — it estimates how
 * the chosen variables push extraction up/down so the result can be plotted on
 * the SCA chart. Measured TDS (refractometer) overrides the estimate.
 */
export function predict(c: BrewConfig): Prediction {
  const dripper = DRIPPERS.find((d) => d.id === c.dripperId) ?? DRIPPERS[0]
  const filter = FILTERS.find((f) => f.id === c.filterId) ?? FILTERS[0]
  const process = PROCESSES.find((p) => p.id === c.processId) ?? PROCESSES[0]
  const roast = roastFromAgtron(c.agtron)

  const totalWater = c.dose * c.ratio
  const beverageMass = Math.max(1, totalWater - c.dose * ABSORPTION)

  // Flow & contact time. ~5 g/s is a realistic average drawdown rate for a
  // medium V60 grind; geometry/filter and grind scale it from there.
  const combinedFlow = dripper.flowFactor * filter.flowFactor
  const flowRate = round1(clamp(5 * combinedFlow * (c.micron / 650), 1.5, 14)) // g/s
  const lastPourAt = c.pours.length ? Math.max(...c.pours.map((p) => p.at)) : 0
  const drawdown = Math.max(25, totalWater / flowRate)
  const brewTimeSec = Math.round(lastPourAt + drawdown)

  // Extraction yield estimate (additive contributions in EY % points, each
  // bounded so no single lever dominates, then modest roast/process factors).
  const grindAdj = clamp(((700 - c.micron) / 100) * 0.9, -5, 5) // finer → higher
  const tempAdj = clamp((c.tempC - 93) * 0.25, -3, 3) // hotter → higher
  const contactAdj = clamp(-Math.log(combinedFlow) * 3, -3, 4) // slower drawdown → higher
  const aggressive = c.pours.filter((p) => p.style === 'aggressive' || p.style === 'pulse').length
  const agitationAdj = clamp((c.pours.length - 3) * 0.3 + aggressive * 0.5, -1.5, 3)

  // Roast: darker beans are more soluble; process nudges slightly. Kept modest
  // (multipliers ~0.95–1.09) so grind/temp/flow remain the primary drivers.
  const roastFactor = 1 + (roast.extraction - 1) * 0.5
  const processFactor = 1 + (process.extraction - 1) * 0.4

  let ey = (19.5 + grindAdj + tempAdj + contactAdj + agitationAdj) * roastFactor * processFactor
  ey = clamp(ey, 14, 26)

  // TDS from mass balance: dissolved solids / beverage mass
  let tds = clamp((c.dose * (ey / 100)) / beverageMass * 100, 0.6, 1.9)

  let source: Prediction['source'] = 'predicted'
  if (c.useMeasured && c.measuredTds && c.measuredTds > 0) {
    tds = c.measuredTds
    const y = c.measuredYield && c.measuredYield > 0 ? c.measuredYield : beverageMass
    ey = clamp((y * (tds / 100)) / c.dose * 100, 5, 35)
    source = 'measured'
  }

  return {
    totalWater: round1(totalWater),
    beverageMass: round1(c.useMeasured && c.measuredYield ? c.measuredYield : beverageMass),
    ey: round1(ey),
    tds: round2(tds),
    brewTimeSec,
    flowRate,
    source,
    hints: buildHints(ey, tds),
  }
}

function buildHints(ey: number, tds: number): { id: string; en: string }[] {
  const out: { id: string; en: string }[] = []
  if (ey < 18)
    out.push({ id: 'EY rendah → giling lebih halus, naikkan suhu, atau perlama kontak.', en: 'Low EY → grind finer, raise temp, or extend contact time.' })
  else if (ey > 22)
    out.push({ id: 'EY tinggi → giling lebih kasar, turunkan suhu, kurangi agitasi.', en: 'High EY → grind coarser, lower temp, reduce agitation.' })
  if (tds < 1.15)
    out.push({ id: 'TDS rendah (encer) → naikkan rasio kopi (kurangi air) atau giling halus.', en: 'Low TDS (weak) → raise coffee ratio (less water) or grind finer.' })
  else if (tds > 1.35)
    out.push({ id: 'TDS tinggi (kuat) → turunkan rasio (tambah air).', en: 'High TDS (strong) → lower ratio (add water).' })
  if (out.length === 0)
    out.push({ id: 'Mantap — di zona ideal Gold Cup. 👌', en: 'Nice — inside the Gold Cup ideal zone. 👌' })
  return out
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const round1 = (v: number) => Math.round(v * 10) / 10
const round2 = (v: number) => Math.round(v * 100) / 100
