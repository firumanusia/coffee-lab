import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const prisma = new PrismaClient()
const CATALOG = resolve(__dirname, '..', '..', '..', 'packages', 'shared', 'catalog')

const load = <T>(file: string): T[] => JSON.parse(readFileSync(resolve(CATALOG, file), 'utf-8'))

async function main() {
  const waters = load<any>('waters.json')
  const beans = load<any>('beans.json')
  const drippers = load<any>('drippers.json')
  const filters = load<any>('filters.json')
  const grinders = load<any>('grinders.json')
  const recipes = load<any>('recipes.json')
  const processes = load<any>('processes.json')

  for (const w of waters) await prisma.water.upsert({ where: { id: w.id }, create: w, update: w })
  for (const b of beans) await prisma.bean.upsert({ where: { id: b.id }, create: b, update: b })
  for (const d of drippers) await prisma.dripper.upsert({ where: { id: d.id }, create: d, update: d })
  for (const f of filters) await prisma.paperFilter.upsert({ where: { id: f.id }, create: f, update: f })
  for (const g of grinders) await prisma.grinder.upsert({ where: { id: g.id }, create: g, update: g })
  for (const p of processes) await prisma.process.upsert({ where: { id: p.id }, create: p, update: p })
  for (const r of recipes) {
    const data = {
      id: r.id, name: r.name, author: r.author, dose: r.dose, ratio: r.ratio,
      tempC: r.tempC, agtron: r.agtron, fixed: r.fixed, pours: r.pours, description: r.description,
    }
    await prisma.recipe.upsert({ where: { id: r.id }, create: data, update: data })
  }

  console.log(
    `Seeded: ${waters.length} waters, ${beans.length} beans, ${drippers.length} drippers, ` +
      `${filters.length} filters, ${grinders.length} grinders, ${processes.length} processes, ${recipes.length} recipes`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
