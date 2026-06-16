import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { CatalogModule } from './catalog/catalog.module'
import { AuthModule } from './auth/auth.module'
import { UserDataModule } from './userdata/userdata.module'
import { AdminModule } from './admin/admin.module'
import { HealthController } from './health/health.controller'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CatalogModule, AuthModule, UserDataModule, AdminModule],
  controllers: [HealthController],
})
export class AppModule {}
