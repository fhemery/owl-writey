import { Module } from '@nestjs/common';
import { EventsModule } from '@owl/back/infra/events';
import { TrackingModule } from '@owl/back/tracking';

import {
  CreateNovelCommand,
  DeleteAllNovelsCommand,
  DeleteNovelCommand,
  GetAllNovelsQuery,
  GetNovelEventsQuery,
  GetNovelQuery,
  NovelApplyEventCommand,
  UpdateNovelCommand,
} from './domain/ports';
import { NovelEventsController } from './infra/api/novel-events.controller';
import { NovelsController } from './infra/api/novels.controller';
import { NovelTrackingListeners } from './infra/tracking';
import { NovelTypeormModule } from './infra/typeorm-repository/novel-typeorm.module';
import { NovelUserModule } from './infra/user-facade/novel-user.module';

@Module({
  imports: [NovelTypeormModule, NovelUserModule, TrackingModule, EventsModule],
  controllers: [NovelsController, NovelEventsController],
  providers: [
    CreateNovelCommand,
    GetNovelQuery,
    GetAllNovelsQuery,
    DeleteAllNovelsCommand,
    UpdateNovelCommand,
    DeleteNovelCommand,
    NovelApplyEventCommand,
    GetNovelEventsQuery,
    NovelTrackingListeners,
  ],
  exports: [],
})
export class NovelsModule {}
