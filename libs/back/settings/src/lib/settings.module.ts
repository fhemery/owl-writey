import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingModule } from '@owl/back/tracking';
import { UsersModule } from '@owl/back/user';

import { SettingsRepositoryPort, SettingsService } from './domain/ports';
import {
  SettingsEntity,
  TypeORMSettingRepository,
} from './infrastructure/persistence/typeorm';
import { SettingsController } from './settings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettingsEntity]),
    UsersModule,
    TrackingModule,
  ],
  controllers: [SettingsController],
  providers: [
    {
      provide: SettingsRepositoryPort,
      useClass: TypeORMSettingRepository,
    },
    SettingsService,
  ],
})
export class SettingsModule {}
