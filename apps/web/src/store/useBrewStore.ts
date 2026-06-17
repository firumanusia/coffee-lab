import { useCallback, useEffect, useMemo, useState } from 'react'
import { RECIPES, type Recipe } from '../data/recipes'
import { BEANS } from '../data/generated/beans'
import { PROCESSES } from '../data/generated/processes'
import { suggestTemp } from '../data/water'
import { api } from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import { loadLog, loadPresets, saveLog, savePresets, uid } from './storage'
import type { BrewConfig, BrewFeedback, BrewLogEntry, Preset } from './types'

export function configFromRecipe(r: Recipe): BrewConfig {
  return {
    tempC: r.tempC,
    waterId: 'aqua',
    grinderId: 'comandante-c40-mk4',
    micron: 650,
    beanId: BEANS[0]?.id ?? '',
    processId: PROCESSES[0]?.name ?? 'Washed (Full Wash)',
    agtron: r.agtron,
    dripperId: 'hario-v60-01',
    filterId: 'hario-v60-tabbed-jepang',
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
  const { user } = useAuth()
  const [config, setConfig] = useState<BrewConfig>(DEFAULT_CONFIG)
  const [presets, setPresets] = useState<Preset[]>(loadPresets)
  const [log, setLog] = useState<BrewLogEntry[]>(loadLog)

  // When signed in, presets/logs live in the cloud; otherwise localStorage.
  useEffect(() => {
    let alive = true
    if (user) {
      api.get<Preset[]>('/presets').then((p) => alive && setPresets(p)).catch(() => {})
      api.get<BrewLogEntry[]>('/brew-logs').then((l) => alive && setLog(l)).catch(() => {})
    } else {
      setPresets(loadPresets())
      setLog(loadLog())
    }
    return () => {
      alive = false
    }
  }, [user])

  const update = useCallback((patch: Partial<BrewConfig>) => setConfig((c) => ({ ...c, ...patch })), [])

  const applyRecipe = useCallback((r: Recipe) => {
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
    async (name: string) => {
      if (user) {
        const p = await api.post<Preset>('/presets', { name, config })
        setPresets((prev) => [p, ...prev])
      } else {
        const p: Preset = { id: uid(presets.length + 1), name, config, createdAt: Date.now() }
        const next = [p, ...presets]
        setPresets(next)
        savePresets(next)
      }
    },
    [config, presets, user],
  )

  const loadPreset = useCallback((p: Preset) => setConfig({ ...p.config }), [])

  const deletePreset = useCallback(
    async (id: string) => {
      if (user) await api.del(`/presets/${id}`).catch(() => {})
      const next = presets.filter((p) => p.id !== id)
      setPresets(next)
      if (!user) savePresets(next)
    },
    [presets, user],
  )

  const addLog = useCallback(
    async (entry: { name: string; result: BrewLogEntry['result']; feedback: BrewFeedback }) => {
      if (user) {
        const e = await api.post<BrewLogEntry>('/brew-logs', { name: entry.name, config, result: entry.result, feedback: entry.feedback })
        setLog((prev) => [e, ...prev])
      } else {
        const e: BrewLogEntry = { id: uid(log.length + 1), name: entry.name, createdAt: Date.now(), config, result: entry.result, feedback: entry.feedback }
        const next = [e, ...log]
        setLog(next)
        saveLog(next)
      }
    },
    [config, log, user],
  )

  const deleteLog = useCallback(
    async (id: string) => {
      if (user) await api.del(`/brew-logs/${id}`).catch(() => {})
      const next = log.filter((e) => e.id !== id)
      setLog(next)
      if (!user) saveLog(next)
    },
    [log, user],
  )

  const sortedPresets = useMemo(
    () => [...presets].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [presets],
  )

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
