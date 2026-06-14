import type { PaperFilter } from './types'

export const FILTERS: PaperFilter[] = [
  { id: 'hario-tabbed', name: 'V60 Tabbed (bleached)', brand: 'Hario', flowFactor: 1.0, thickness: { id: 'Sedang', en: 'Medium' }, characteristics: { id: 'Standar, seimbang antara clarity dan body.', en: 'Standard, balanced clarity and body.' } },
  { id: 'cafec-abaca', name: 'Abaca+ ', brand: 'CAFEC', flowFactor: 1.18, thickness: { id: 'Tipis', en: 'Thin' }, characteristics: { id: 'Serat abaca, aliran cepat, drawdown lancar.', en: 'Abaca fiber, fast flow, smooth drawdown.' } },
  { id: 'cafec-light', name: 'Light Roast (T-90)', brand: 'CAFEC', flowFactor: 1.22, thickness: { id: 'Tipis', en: 'Thin' }, characteristics: { id: 'Untuk roast terang — aliran cepat, asiditas cerah.', en: 'For light roasts — fast flow, bright acidity.' } },
  { id: 'cafec-dark', name: 'Dark Roast (T-100)', brand: 'CAFEC', flowFactor: 0.82, thickness: { id: 'Tebal', en: 'Thick' }, characteristics: { id: 'Untuk roast gelap — aliran lambat, kurangi pahit.', en: 'For dark roasts — slow flow, tames bitterness.' } },
  { id: 'kalita-wave-filter', name: 'Wave 185', brand: 'Kalita', flowFactor: 0.9, thickness: { id: 'Tebal', en: 'Thick' }, characteristics: { id: 'Crimped, menjaga bentuk bed merata.', en: 'Crimped walls, keep bed even.' } },
  { id: 'chemex-filter', name: 'Bonded', brand: 'Chemex', flowFactor: 0.65, thickness: { id: 'Sangat tebal', en: 'Very thick' }, characteristics: { id: 'Menyaring minyak & halusan — sangat bersih.', en: 'Filters oils & fines — ultra clean cup.' } },
  { id: 'sibarist-fast', name: 'FAST', brand: 'Sibarist', flowFactor: 1.35, thickness: { id: 'Tipis (kain teknis)', en: 'Thin (technical fabric)' }, characteristics: { id: 'Aliran sangat cepat, cocok grind halus.', en: 'Very fast flow, suits fine grinds.' } },
  { id: 'origami-cone-filter', name: 'Cone (V60 compatible)', brand: 'Origami', flowFactor: 1.05, thickness: { id: 'Sedang', en: 'Medium' }, characteristics: { id: 'Kompatibel cone, aliran sedikit cepat.', en: 'Cone compatible, slightly faster flow.' } },
  { id: 'whatman', name: 'Lab Filter (#1/#2)', brand: 'Whatman', flowFactor: 0.78, thickness: { id: 'Tebal', en: 'Thick' }, characteristics: { id: 'Sangat seragam, clarity ekstrem, lambat.', en: 'Highly uniform, extreme clarity, slow.' } },
]
