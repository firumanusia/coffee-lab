import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { IsObject, IsOptional, IsString } from 'class-validator'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/guards'
import { CurrentUser, type AuthUser } from '../auth/decorators'

class PresetDto {
  @IsString() name!: string
  @IsObject() config!: Record<string, unknown>
}
class BrewLogDto {
  @IsString() name!: string
  @IsObject() config!: Record<string, unknown>
  @IsObject() result!: Record<string, unknown>
  @IsObject() feedback!: Record<string, unknown>
}
class PresetPatchDto {
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsObject() config?: Record<string, unknown>
}

@ApiTags('user-data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class UserDataController {
  constructor(private readonly prisma: PrismaService) {}

  // ---- Presets ----
  @Get('presets')
  presets(@CurrentUser() u: AuthUser) {
    return this.prisma.preset.findMany({ where: { userId: u.userId }, orderBy: { createdAt: 'desc' } })
  }

  @Post('presets')
  createPreset(@CurrentUser() u: AuthUser, @Body() dto: PresetDto) {
    return this.prisma.preset.create({ data: { userId: u.userId, name: dto.name, config: dto.config as any } })
  }

  @Patch('presets/:id')
  async updatePreset(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body() dto: PresetPatchDto) {
    await this.owned('preset', id, u.userId)
    return this.prisma.preset.update({ where: { id }, data: { name: dto.name, config: dto.config as any } })
  }

  @Delete('presets/:id')
  async deletePreset(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    await this.owned('preset', id, u.userId)
    await this.prisma.preset.delete({ where: { id } })
    return { ok: true }
  }

  // ---- Brew logs ----
  @Get('brew-logs')
  logs(@CurrentUser() u: AuthUser) {
    return this.prisma.brewLog.findMany({ where: { userId: u.userId }, orderBy: { createdAt: 'desc' } })
  }

  @Post('brew-logs')
  createLog(@CurrentUser() u: AuthUser, @Body() dto: BrewLogDto) {
    return this.prisma.brewLog.create({
      data: { userId: u.userId, name: dto.name, config: dto.config as any, result: dto.result as any, feedback: dto.feedback as any },
    })
  }

  @Delete('brew-logs/:id')
  async deleteLog(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    await this.owned('brewLog', id, u.userId)
    await this.prisma.brewLog.delete({ where: { id } })
    return { ok: true }
  }

  private async owned(model: 'preset' | 'brewLog', id: string, userId: string) {
    const row = await (this.prisma[model] as any).findUnique({ where: { id } })
    if (!row || row.userId !== userId) throw new NotFoundException()
  }
}
