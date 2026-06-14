/** Bilingual string pair used throughout the data layer. */
export interface L {
  id: string
  en: string
}

export interface Origin {
  id: string
  name: string
  varieties: string[]
  flavor: L
}

export interface Process {
  id: string
  name: L
  /** extraction solubility multiplier (1 = neutral) */
  extraction: number
  flavor: L
}

export interface Grinder {
  id: string
  brand: string
  model: string
  type: 'hand' | 'electric'
  /** micron per setting step, for suggested-setting math */
  micronPerStep: number
  /** typical usable micron range */
  range: [number, number]
  notes: L
}

export interface Dripper {
  id: string
  name: string
  brand: string
  geometry: 'conical' | 'flat' | 'hybrid'
  /** >1 faster drawdown, <1 slower */
  flowFactor: number
  characteristics: L
}

export interface PaperFilter {
  id: string
  name: string
  brand: string
  /** >1 faster, <1 slower flow */
  flowFactor: number
  thickness: L
  characteristics: L
}
