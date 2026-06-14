import { useCallback, useMemo, useState } from 'react'
import { RECIPES, type Recipe } from '../data/recipes'
import { suggestTemp } from '../data/water'
import { loadLog, loadPresets, saveLog, savePresets, uid } from './storage'
import type { BrewConfig, BrewFeedback, BrewLogEntry, Preset } from './types'

export function configFromRecipe(r: Recipe): BrewConfig {
  return {
    tempC: r.tempC,
    grinderId: 'comandante-c40',
    micron: 650,
    originId: 'ethiopia',
    variety: 'Heirloom',
    processId: 'washed',
    agtron: r.agtron,
    dripperId: 'hario-v60',
    filterId: 'hario-tabbed',
    recipeId: r.id,
    dose: r.dose,
    ratio: r.ratio,
    pours: r.pours.map((p) => ({ ...p })),
    fixedPours: r.fixed,
    useMeasured: false,
  }
}

const DEFAULT_CONFIG = configFromRecipe(RECIPES.find((r) => r.id === 'custom-basic')!)

export function useBrewStore() {
  const [config, setConfig] = useState<BrewConfig>(DEFAULT_CONFIG)
  const [presets, setPresets] = useState<Preset[]>(loadPresets)
  const [log, setLog] = useState<BrewLogEntry[]>(loadLog)

  const update = useCallback((patch: Partial<BrewConfig>) => {
    setConfig((c) => ({ ...c, ...patch }))
  }, [])

  /** Apply a recipe; optionally sync temp to its roast. */
  const applyRecipe = useCallback((recipeId: string) => {
    const r = RECIPES.find((x) => x.id === recipeId)
    if (!r) return
    setConfig((c) => ({
      ...c,
      recipeId: r.id,
      dose: r.dose,
      ratio: r.ratio,
      tempC: suggestTemp(r.agtron),
      agtron: r.agtron,
      pours: r.pours.map((p) => ({ ...p })),
      fixedPours: r.fixed,
    }))
  }, [])

  const savePreset = useCallback(
    (name: string) => {
      const p: Preset = { id: uid(presets.length + 1), name, config, createdAt: Date.now() }
      const next = [p, ...presets]
      setPresets(next)
      savePresets(next)
    },
    [config, presets],
  )

  const loadPreset = useCallback((p: Preset) => setConfig({ ...p.config }), [])

  const deletePreset = useCallback(
    (id: string) => {
      const next = presets.filter((p) => p.id !== id)
      setPresets(next)
      savePresets(next)
    },
    [presets],
  )

  const addLog = useCallback(
    (entry: { name: string; result: BrewLogEntry['result']; feedback: BrewFeedback }) => {
      const e: BrewLogEntry = {
        id: uid(log.length + 1),
        name: entry.name,
        createdAt: Date.now(),
        config,
        result: entry.result,
        feedback: entry.feedback,
      }
      const next = [e, ...log]
      setLog(next)
      saveLog(next)
    },
    [config, log],
  )

  const deleteLog = useCallback(
    (id: string) => {
      const next = log.filter((e) => e.id !== id)
      setLog(next)
      saveLog(next)
    },
    [log],
  )

  const sortedPresets = useMemo(() => [...presets].sort((a, b) => b.createdAt - a.createdAt), [presets])

  return {
    config,
    update,
    setConfig,
    applyRecipe,
    presets: sortedPresets,
    savePreset,
    loadPreset,
    deletePreset,
    log,
    addLog,
    deleteLog,
  }
}

export type BrewStore = ReturnType<typeof useBrewStore>
