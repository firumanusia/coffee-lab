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

  // More hand grinders
  { id: 'timemore-c2', brand: 'Timemore', model: 'Chestnut C2', type: 'hand', micronPerStep: 36, range: [250, 1200], notes: { id: 'Versi awal yang terjangkau.', en: 'Affordable earlier model.' } },
  { id: '1z-x-pro', brand: '1Zpresso', model: 'X-Pro / X-Ultra', type: 'hand', micronPerStep: 15, range: [200, 1100], notes: { id: 'Dial atas, cepat disetel.', en: 'Top dial, quick to adjust.' } },
  { id: '1z-zp6', brand: '1Zpresso', model: 'ZP6 Special', type: 'hand', micronPerStep: 25, range: [400, 1300], notes: { id: 'Burr khusus filter — clarity tinggi.', en: 'Filter-dedicated burr — high clarity.' } },
  { id: 'kinu-m47', brand: 'Kinu', model: 'M47', type: 'hand', micronPerStep: 10, range: [180, 1100], notes: { id: 'Stepless, build logam premium.', en: 'Stepless, premium metal build.' } },
  { id: 'kingrinder-k4', brand: 'Kingrinder', model: 'K4', type: 'hand', micronPerStep: 18, range: [180, 1100], notes: { id: 'Dial eksternal value.', en: 'External-dial value option.' } },
  { id: 'hario-skerton', brand: 'Hario', model: 'Skerton Pro', type: 'hand', micronPerStep: 50, range: [400, 1300], notes: { id: 'Entry ceramic burr, kurang seragam.', en: 'Entry ceramic burr, less uniform.' } },

  // More electric grinders
  { id: 'fellow-opus', brand: 'Fellow', model: 'Opus', type: 'electric', micronPerStep: 35, range: [200, 1400], notes: { id: 'All-purpose, espresso–cold brew.', en: 'All-purpose, espresso–cold brew.' } },
  { id: 'mahlkonig-x54', brand: 'Mahlkönig', model: 'X54', type: 'electric', micronPerStep: 20, range: [200, 1200], notes: { id: 'Home grinder kelas kafe.', en: 'Café-grade home grinder.' } },
  { id: 'option-o-lagom', brand: 'Option-O', model: 'Lagom Mini', type: 'electric', micronPerStep: 8, range: [180, 1100], notes: { id: 'Single-dose stepless presisi.', en: 'Precise single-dose stepless.' } },
  { id: 'comandante-c40-e', brand: 'Weber', model: 'Key', type: 'electric', micronPerStep: 6, range: [180, 1100], notes: { id: 'High-end stepless, sangat seragam.', en: 'High-end stepless, very uniform.' } },
  { id: 'varia-evo', brand: 'Varia', model: 'EVO', type: 'electric', micronPerStep: 9, range: [180, 1200], notes: { id: 'Flat+conical, fleksibel.', en: 'Flat+conical, flexible.' } },
]

/** Suggested setting (clicks/steps from closed) for a target micron. */
export function suggestSetting(g: Grinder, micron: number): number {
  const clamped = Math.min(g.range[1], Math.max(g.range[0], micron))
  return Math.max(0, Math.round((clamped - g.range[0]) / g.micronPerStep))
}
