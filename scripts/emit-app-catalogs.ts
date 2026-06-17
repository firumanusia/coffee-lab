// Emits recipes.json into packages/shared/catalog from the hand-authored web
// data, so the API seed has the recipes catalog. (Processes now come from the
// sheet via generate_data.py.) Run: npx tsx scripts/emit-app-catalogs.ts
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { RECIPES } from '../apps/web/src/data/recipes'

const OUT = resolve(__dirname, '..', 'packages', 'shared', 'catalog')
writeFileSync(resolve(OUT, 'recipes.json'), JSON.stringify(RECIPES, null, 2), 'utf-8')
console.log(`recipes: ${RECIPES.length}`)
