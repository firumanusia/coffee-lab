import type { Grinder } from './generated/grinders'

/** Suggested setting (clicks/steps from closed) for a target micron, or null if stepless/unknown. */
export function suggestSetting(g: Pick<Grinder, 'umPerStep' | 'minMicron' | 'maxMicron'>, micron: number): number | null {
  if (!g.umPerStep) return null
  const clamped = Math.min(g.maxMicron, Math.max(g.minMicron, micron))
  return Math.max(0, Math.round((clamped - g.minMicron) / g.umPerStep))
}
