// Emits recipes.json + processes.json into packages/shared/catalog from the
// hand-authored web data, so the API seed has every catalog. Run: npx tsx scripts/emit-app-catalogs.ts
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { RECIPES } from '../apps/web/src/data/recipes'
import { processInfo } from '../apps/web/src/data/processInfo'
import { BEANS } from '../apps/web/src/data/generated/beans'

const OUT = resolve(__dirname, '..', 'packages', 'shared', 'catalog')
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x'

writeFileSync(resolve(OUT, 'recipes.json'), JSON.stringify(RECIPES, null, 2), 'utf-8')

const names = new Set<string>()
BEANS.forEach((b) => b.processes.forEach((p) => names.add(p)))
const processes = [...names].sort().map((n) => {
  const info = processInfo(n)
  return { id: slug(n), nameId: n, nameEn: n, extraction: info.extraction, flavorId: info.flavor.id, flavorEn: info.flavor.en }
})
writeFileSync(resolve(OUT, 'processes.json'), JSON.stringify(processes, null, 2), 'utf-8')

console.log(`recipes: ${RECIPES.length}, processes: ${processes.length}`)
