import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { CatalogModule } from './catalog/catalog.module'
import { HealthController } from './health/health.controller'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CatalogModule],
  controllers: [HealthController],
})
export class AppModule {}
