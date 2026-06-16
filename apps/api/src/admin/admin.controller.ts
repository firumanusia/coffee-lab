import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard, RolesGuard } from '../auth/guards'
import { Roles } from '../auth/decorators'

// resource path -> Prisma delegate name
const DELEGATES: Record<string, string> = {
  waters: 'water',
  beans: 'bean',
  grinders: 'grinder',
  drippers: 'dripper',
  filters: 'paperFilter',
  recipes: 'recipe',
  processes: 'process',
  users: 'user',
  logs: 'brewLog',
  presets: 'preset',
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(resource: string): any {
    const name = DELEGATES[resource]
    if (!name) throw new BadRequestException(`Unknown resource: ${resource}`)
    return (this.prisma as any)[name]
  }

  /** Strip server-managed / sensitive fields from incoming payloads. */
  private clean(resource: string, body: Record<string, any>) {
    const { createdAt, updatedAt, passwordHash, ...rest } = body ?? {}
    if (resource === 'users') {
      const { id, email, googleId, role, name } = rest // only allow role/name edits
      return { id, email, googleId, role, name }
    }
    return rest
  }

  @Get(':resource')
  list(@Param('resource') resource: string) {
    return this.delegate(resource).findMany({ orderBy: { createdAt: 'desc' } }).catch(() => this.delegate(resource).findMany())
  }

  @Get(':resource/:id')
  async one(@Param('resource') resource: string, @Param('id') id: string) {
    const row = await this.delegate(resource).findUnique({ where: { id } })
    if (!row) throw new NotFoundException()
    return row
  }

  @Post(':resource')
  create(@Param('resource') resource: string, @Body() body: Record<string, any>) {
    return this.delegate(resource).create({ data: this.clean(resource, body) })
  }

  @Put(':resource/:id')
  update(@Param('resource') resource: string, @Param('id') id: string, @Body() body: Record<string, any>) {
    const { id: _omit, ...data } = this.clean(resource, body)
    return this.delegate(resource).update({ where: { id }, data })
  }

  @Patch(':resource/:id')
  patch(@Param('resource') resource: string, @Param('id') id: string, @Body() body: Record<string, any>) {
    const { id: _omit, ...data } = this.clean(resource, body)
    return this.delegate(resource).update({ where: { id }, data })
  }

  @Delete(':resource/:id')
  async remove(@Param('resource') resource: string, @Param('id') id: string) {
    await this.delegate(resource).delete({ where: { id } })
    return { id }
  }
}
