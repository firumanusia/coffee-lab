import { Module } from '@nestjs/common'
import { UserDataController } from './userdata.controller'

@Module({ controllers: [UserDataController] })
export class UserDataModule {}
