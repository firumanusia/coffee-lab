import type { PourStep } from '../data/recipes'

export interface BrewConfig {
  // water
  tempC: number
  // grind
  grinderId: string
  micron: number
  // beans
  originId: string
  variety: string
  processId: string
  agtron: number
  // gear
  dripperId: string
  filterId: string
  // recipe
  recipeId: string
  dose: number
  ratio: number
  pours: PourStep[]
  fixedPours: boolean
  // measured override
  useMeasured: boolean
  measuredTds?: number
  measuredYield?: number
}

export interface Preset {
  id: string
  name: string
  config: BrewConfig
  createdAt: number
}

export interface BrewFeedback {
  rating: number // 1..5
  notes: string // tasting notes / flavor tags
  body: number // 1..5
  acidity: number // 1..5
  sweetness: number // 1..5
  improvement: string // free-text ideas
}

export interface BrewLogEntry {
  id: string
  name: string
  createdAt: number
  config: BrewConfig
  result: { yield: number; tds: number; ey: number }
  feedback: BrewFeedback
}
