import type { BrewLogEntry, Preset } from './types'

const PRESETS_KEY = 'brewlab.presets'
const LOG_KEY = 'brewlab.history'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode — ignore */
  }
}

export const loadPresets = () => read<Preset[]>(PRESETS_KEY, [])
export const savePresets = (p: Preset[]) => write(PRESETS_KEY, p)

export const loadLog = () => read<BrewLogEntry[]>(LOG_KEY, [])
export const saveLog = (l: BrewLogEntry[]) => write(LOG_KEY, l)

/** Small unique id without external deps. */
export function uid(seed: number): string {
  return seed.toString(36) + Math.floor(performance.now() % 1e6).toString(36)
}
