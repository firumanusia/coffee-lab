import type { Dripper } from './types'

export const DRIPPERS: Dripper[] = [
  // Conical
  { id: 'hario-v60', name: 'V60', brand: 'Hario', geometry: 'conical', flowFactor: 1.15, characteristics: { id: 'Rib spiral, lubang besar tunggal — aliran cepat, clarity tinggi.', en: 'Spiral ribs, single large hole — fast flow, high clarity.' } },
  { id: 'origami-cone', name: 'Origami (cone)', brand: 'Origami', geometry: 'conical', flowFactor: 1.2, characteristics: { id: 'Rib vertikal, sangat cepat dengan filter V60.', en: 'Fluted vertical ribs, very fast with V60 filters.' } },
  { id: 'ufo-dripper', name: 'UFO', brand: 'UFO / Brewista', geometry: 'conical', flowFactor: 1.1, characteristics: { id: 'Conical dengan dasar rata kecil, aliran terkontrol.', en: 'Conical with small flat base, controlled flow.' } },
  { id: 'hario-switch', name: 'Switch', brand: 'Hario', geometry: 'hybrid', flowFactor: 0.85, characteristics: { id: 'V60 + katup immersion — kontrol penuh waktu kontak.', en: 'V60 + immersion valve — full contact-time control.' } },
  { id: 'april-plastic', name: 'April', brand: 'April', geometry: 'conical', flowFactor: 1.05, characteristics: { id: 'Conical kompetisi, drawdown stabil.', en: 'Competition conical, stable drawdown.' } },

  // Flat bottom
  { id: 'kalita-wave', name: 'Wave 185', brand: 'Kalita', geometry: 'flat', flowFactor: 0.9, characteristics: { id: 'Dasar rata 3 lubang — ekstraksi merata, forgiving.', en: 'Flat 3-hole base — even extraction, forgiving.' } },
  { id: 'solo-dripper', name: 'Solo', brand: 'Solo (Cafec)', geometry: 'flat', flowFactor: 0.95, characteristics: { id: 'Flat bottom modern, body manis tebal.', en: 'Modern flat bottom, sweet full body.' } },
  { id: 'suji-panca', name: 'Panca', brand: 'Suji', geometry: 'flat', flowFactor: 0.92, characteristics: { id: 'Flat bottom lokal, hasil seimbang & manis.', en: 'Local flat bottom, balanced & sweet.' } },
  { id: 'beandy-silky', name: 'Silky', brand: 'Beandy', geometry: 'flat', flowFactor: 0.88, characteristics: { id: 'Flat bottom dengan drawdown lambat, body penuh.', en: 'Flat bottom with slow drawdown, full body.' } },
  { id: 'orea-v4', name: 'Orea V4', brand: 'Orea', geometry: 'flat', flowFactor: 1.25, characteristics: { id: 'Flat bottom super cepat, fleksibel.', en: 'Very fast flat bottom, flexible.' } },
  { id: 'fellow-stagg', name: 'Stagg [X/XF]', brand: 'Fellow', geometry: 'flat', flowFactor: 0.95, characteristics: { id: 'Flat bottom dengan filter sendiri, konsisten.', en: 'Flat bottom with dedicated filter, consistent.' } },

  // Other / hybrid
  { id: 'chemex', name: 'Chemex', brand: 'Chemex', geometry: 'hybrid', flowFactor: 0.7, characteristics: { id: 'Filter sangat tebal — sangat bersih, low body, lambat.', en: 'Very thick filter — ultra clean, low body, slow.' } },
  { id: 'clever', name: 'Clever Dripper', brand: 'Clever', geometry: 'hybrid', flowFactor: 0.8, characteristics: { id: 'Immersion + katup, sangat forgiving.', en: 'Immersion + valve, very forgiving.' } },
  { id: 'flower-dripper', name: 'Flower', brand: 'CAFEC', geometry: 'conical', flowFactor: 1.12, characteristics: { id: 'Rib 20 sudut, aliran lancar konsisten.', en: '20-rib design, smooth consistent flow.' } },
]
