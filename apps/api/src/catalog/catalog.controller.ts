import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

/** Public read-only catalog endpoints. Writes are added (admin-only) in Phase 5. */
@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly prisma: PrismaService) {}

  // Waters
  @Get('waters') waters() { return this.prisma.water.findMany({ orderBy: { name: 'asc' } }) }
  @Get('waters/:id') water(@Param('id') id: string) { return this.one(this.prisma.water.findUnique({ where: { id } })) }

  // Beans
  @Get('beans') beans() { return this.prisma.bean.findMany({ orderBy: [{ origin: 'asc' }, { region: 'asc' }] }) }
  @Get('beans/:id') bean(@Param('id') id: string) { return this.one(this.prisma.bean.findUnique({ where: { id } })) }

  // Grinders (public list = active only; admin sees all via /admin/grinders)
  @Get('grinders') grinders() { return this.prisma.grinder.findMany({ where: { active: true }, orderBy: [{ brand: 'asc' }, { model: 'asc' }] }) }
  @Get('grinders/:id') grinder(@Param('id') id: string) { return this.one(this.prisma.grinder.findUnique({ where: { id } })) }

  // Drippers
  @Get('drippers') drippers() { return this.prisma.dripper.findMany({ orderBy: [{ brand: 'asc' }, { model: 'asc' }] }) }
  @Get('drippers/:id') dripper(@Param('id') id: string) { return this.one(this.prisma.dripper.findUnique({ where: { id } })) }

  // Filters
  @Get('filters') filters() { return this.prisma.paperFilter.findMany({ orderBy: [{ brand: 'asc' }, { model: 'asc' }] }) }
  @Get('filters/:id') filter(@Param('id') id: string) { return this.one(this.prisma.paperFilter.findUnique({ where: { id } })) }

  // Recipes
  @Get('recipes') recipes() { return this.prisma.recipe.findMany({ orderBy: { name: 'asc' } }) }
  @Get('recipes/:id') recipe(@Param('id') id: string) { return this.one(this.prisma.recipe.findUnique({ where: { id } })) }

  // Processes
  @Get('processes') processes() { return this.prisma.process.findMany({ orderBy: { name: 'asc' } }) }
  @Get('processes/:id') process(@Param('id') id: string) { return this.one(this.prisma.process.findUnique({ where: { id } })) }

  private async one<T>(p: Promise<T | null>): Promise<T> {
    const row = await p
    if (!row) throw new NotFoundException()
    return row
  }
}
