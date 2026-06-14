import type { Process } from './types'

export const PROCESSES: Process[] = [
  {
    id: 'washed',
    name: { id: 'Washed / Full Wash', en: 'Washed / Full Wash' },
    extraction: 1.0,
    flavor: { id: 'Bersih, clarity tinggi, asiditas cerah.', en: 'Clean, high clarity, bright acidity.' },
  },
  {
    id: 'natural',
    name: { id: 'Natural / Dry', en: 'Natural / Dry' },
    extraction: 1.04,
    flavor: { id: 'Buah matang, body tebal, manis fermentatif.', en: 'Ripe fruit, heavy body, fermented sweetness.' },
  },
  {
    id: 'honey',
    name: { id: 'Honey (white–black)', en: 'Honey (white–black)' },
    extraction: 1.02,
    flavor: { id: 'Manis seimbang, body sedang, asiditas lembut.', en: 'Balanced sweetness, medium body, soft acidity.' },
  },
  {
    id: 'ferment',
    name: { id: 'Fermented (washed control)', en: 'Fermented (controlled)' },
    extraction: 1.06,
    flavor: { id: 'Kompleks, funky, asam bercahaya.', en: 'Complex, funky, vibrant acidity.' },
  },
  {
    id: 'anaerobic',
    name: { id: 'Anaerobic', en: 'Anaerobic' },
    extraction: 1.08,
    flavor: { id: 'Intens, boozy, aromatik, sangat ekspresif.', en: 'Intense, boozy, aromatic, very expressive.' },
  },
  {
    id: 'carbonic',
    name: { id: 'Carbonic Maceration', en: 'Carbonic Maceration' },
    extraction: 1.07,
    flavor: { id: 'Buah merah, wine-like, juicy.', en: 'Red fruit, wine-like, juicy.' },
  },
  {
    id: 'wet-hulled',
    name: { id: 'Wet Hulled (Giling Basah)', en: 'Wet Hulled' },
    extraction: 1.05,
    flavor: { id: 'Earthy, herbal, body sangat tebal — khas Sumatra.', en: 'Earthy, herbal, very full body — classic Sumatra.' },
  },
]
