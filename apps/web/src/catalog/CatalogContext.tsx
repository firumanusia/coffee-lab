import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { WATERS, type Water } from '../data/generated/waters'
import { BEANS, type Bean } from '../data/generated/beans'
import { DRIPPERS, type Dripper } from '../data/generated/drippers'
import { FILTERS, type PaperFilter } from '../data/generated/filters'
import type { Grinder } from '../data/generated/grinders'
import { PROCESSES, type Process } from '../data/generated/processes'
import { RECIPES, type Recipe } from '../data/recipes'

export interface Catalog {
  waters: Water[]
  beans: Bean[]
  grinders: Grinder[]
  drippers: Dripper[]
  filters: PaperFilter[]
  recipes: Recipe[]
  processes: Process[]
  ready: boolean
}

// Small catalogs ship as static fallback so the public page renders instantly
// and survives an API outage; grinders (heavy) come from the API only.
const FALLBACK: Catalog = {
  waters: WATERS,
  beans: BEANS,
  grinders: [],
  drippers: DRIPPERS,
  filters: FILTERS,
  recipes: RECIPES,
  processes: PROCESSES,
  ready: false,
}

const Ctx = createContext<Catalog>(FALLBACK)

const pick = <T,>(r: PromiseSettledResult<T[]>, fallback: T[]): T[] =>
  r.status === 'fulfilled' && Array.isArray(r.value) && r.value.length ? r.value : fallback

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [cat, setCat] = useState<Catalog>(FALLBACK)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [w, b, g, d, f, r, p] = await Promise.allSettled([
        api.get<Water[]>('/waters'),
        api.get<Bean[]>('/beans'),
        api.get<Grinder[]>('/grinders'),
        api.get<Dripper[]>('/drippers'),
        api.get<PaperFilter[]>('/filters'),
        api.get<Recipe[]>('/recipes'),
        api.get<Process[]>('/processes'),
      ])
      if (!alive) return
      setCat({
        waters: pick(w, FALLBACK.waters),
        beans: pick(b, FALLBACK.beans),
        grinders: pick(g, FALLBACK.grinders),
        drippers: pick(d, FALLBACK.drippers),
        filters: pick(f, FALLBACK.filters),
        recipes: pick(r, FALLBACK.recipes),
        processes: pick(p, FALLBACK.processes),
        ready: true,
      })
    })()
    return () => {
      alive = false
    }
  }, [])

  return <Ctx.Provider value={cat}>{children}</Ctx.Provider>
}

export function useCatalog() {
  return useContext(Ctx)
}

/** Resolve the dripper + filter objects for the current config (for predict()). */
export function useGear(config: { dripperId: string; filterId: string }) {
  const { drippers, filters } = useContext(Ctx)
  return {
    dripper: drippers.find((d) => d.id === config.dripperId),
    filter: filters.find((f) => f.id === config.filterId),
  }
}
