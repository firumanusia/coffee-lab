import type { L } from './types'

/** Extraction multiplier + flavor tendency per post-harvest process name. */
interface ProcInfo {
  extraction: number
  flavor: L
}

const TABLE: Record<string, ProcInfo> = {
  washed: { extraction: 1.0, flavor: { id: 'Bersih, clarity tinggi, asiditas cerah.', en: 'Clean, high clarity, bright acidity.' } },
  'full wash': { extraction: 1.0, flavor: { id: 'Bersih, clarity tinggi.', en: 'Clean, high clarity.' } },
  natural: { extraction: 1.04, flavor: { id: 'Buah matang, body tebal, manis fermentatif.', en: 'Ripe fruit, heavy body, fermented sweetness.' } },
  dry: { extraction: 1.04, flavor: { id: 'Buah matang, body tebal.', en: 'Ripe fruit, heavy body.' } },
  honey: { extraction: 1.02, flavor: { id: 'Manis seimbang, body sedang.', en: 'Balanced sweetness, medium body.' } },
  'pulped natural': { extraction: 1.02, flavor: { id: 'Manis, body sedang–tebal.', en: 'Sweet, medium–full body.' } },
  fermented: { extraction: 1.06, flavor: { id: 'Kompleks, funky, asam bercahaya.', en: 'Complex, funky, vibrant acidity.' } },
  anaerobic: { extraction: 1.08, flavor: { id: 'Intens, boozy, aromatik.', en: 'Intense, boozy, aromatic.' } },
  carbonic: { extraction: 1.07, flavor: { id: 'Buah merah, wine-like, juicy.', en: 'Red fruit, wine-like, juicy.' } },
  'wet hulled': { extraction: 1.05, flavor: { id: 'Earthy, herbal, body sangat tebal.', en: 'Earthy, herbal, very full body.' } },
  'giling basah': { extraction: 1.05, flavor: { id: 'Earthy, herbal, body sangat tebal.', en: 'Earthy, herbal, very full body.' } },
}

const DEFAULT: ProcInfo = { extraction: 1.0, flavor: { id: 'Profil seimbang.', en: 'Balanced profile.' } }

export function processInfo(name: string): ProcInfo {
  return TABLE[name.trim().toLowerCase()] ?? DEFAULT
}
