import type { Grinder } from './types'

/**
 * Grinder reference. `micronPerStep` and `range` allow a rough "suggested
 * clicks from zero" estimate: clicks ≈ (targetMicron - range[0]) / micronPerStep.
 * Values are community approximations, not lab-calibrated.
 */
export const GRINDERS: Grinder[] = [
  // Hand grinders
  { id: 'comandante-c40', brand: 'Comandante', model: 'C40 MK4', type: 'hand', micronPerStep: 30, range: [200, 1300], notes: { id: 'Klik dari nol (tutup penuh).', en: 'Clicks from zero (fully closed).' } },
  { id: '1z-jx-pro', brand: '1Zpresso', model: 'JX-Pro', type: 'hand', micronPerStep: 12.5, range: [150, 1200], notes: { id: '1 putaran = 40 klik (12.5µm/klik).', en: '1 rotation = 40 clicks (12.5µm/click).' } },
  { id: '1z-k-ultra', brand: '1Zpresso', model: 'K-Ultra', type: 'hand', micronPerStep: 12.5, range: [150, 1200], notes: { id: 'Dial eksternal, mudah diatur.', en: 'External dial, easy to adjust.' } },
  { id: '1z-q2', brand: '1Zpresso', model: 'Q2', type: 'hand', micronPerStep: 25, range: [200, 1000], notes: { id: 'Ringkas untuk travel.', en: 'Compact for travel.' } },
  { id: 'timemore-c3', brand: 'Timemore', model: 'Chestnut C3', type: 'hand', micronPerStep: 33, range: [200, 1200], notes: { id: 'Entry-level value.', en: 'Entry-level value.' } },
  { id: 'kingrinder-k6', brand: 'Kingrinder', model: 'K6', type: 'hand', micronPerStep: 16, range: [150, 1100], notes: { id: '240 klik per putaran.', en: '240 clicks per rotation.' } },

  // Electric grinders
  { id: 'fellow-ode-2', brand: 'Fellow', model: 'Ode Gen 2', type: 'electric', micronPerStep: 90, range: [300, 1300], notes: { id: 'Khusus filter, 11 setelan bertanda.', en: 'Filter-focused, 11 marked settings.' } },
  { id: 'baratza-encore', brand: 'Baratza', model: 'Encore', type: 'electric', micronPerStep: 30, range: [250, 1200], notes: { id: '40 langkah, populer pemula.', en: '40 steps, popular for beginners.' } },
  { id: 'niche-zero', brand: 'Niche', model: 'Zero', type: 'electric', micronPerStep: 12, range: [200, 1100], notes: { id: 'Stepless dial 0–50.', en: 'Stepless dial 0–50.' } },
  { id: 'df64', brand: 'DF64', model: 'Gen 2', type: 'electric', micronPerStep: 10, range: [180, 1100], notes: { id: 'Single-dose stepless.', en: 'Single-dose stepless.' } },
  { id: 'eureka-mignon', brand: 'Eureka', model: 'Mignon Specialita', type: 'electric', micronPerStep: 8, range: [180, 900], notes: { id: 'Stepless, lebih ke espresso/filter.', en: 'Stepless, espresso/filter.' } },
  { id: 'wilfa-svart', brand: 'Wilfa', model: 'Uniform', type: 'electric', micronPerStep: 25, range: [300, 1200], notes: { id: 'Dirancang untuk brew filter.', en: 'Designed for filter brewing.' } },
]

/** Suggested setting (clicks/steps from closed) for a target micron. */
export function suggestSetting(g: Grinder, micron: number): number {
  const clamped = Math.min(g.range[1], Math.max(g.range[0], micron))
  return Math.max(0, Math.round((clamped - g.range[0]) / g.micronPerStep))
}
