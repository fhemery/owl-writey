import { Module } from '@nestjs/common';
import { EventsModule } from '@owl/back/infra/events';
import { TrackingModule } from '@owl/back/tracking';

import {
  CreateNovelCommand,
  DeleteAllNovelsCommand,
  DeleteNovelCommand,
  GetAllNovelsQuery,
  GetNovelQuery,
  UpdateNovelCommand,
} from './domain/ports';
import { NovelsController } from './infra/api/novels.controller';
import { NovelTrackingListeners } from './infra/tracking';
import { NovelTypeormModule } from './infra/typeorm-repository/novel-typeorm.module';
import { NovelUserModule } from './infra/user-facade/novel-user.module';

@Module({
  imports: [NovelTypeormModule, NovelUserModule, TrackingModule, EventsModule],
  controllers: [NovelsController],
  providers: [
    CreateNovelCommand,
    GetNovelQuery,
    GetAllNovelsQuery,
    DeleteAllNovelsCommand,
    UpdateNovelCommand,
    DeleteNovelCommand,
    NovelTrackingListeners,
  ],
  exports: [],
})
export class NovelsModule {}
