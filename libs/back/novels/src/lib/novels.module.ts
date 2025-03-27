import { Module } from '@nestjs/common';

import {
  CreateNovelCommand,
  DeleteAllNovelsCommand,
  GetAllNovelsQuery,
  GetNovelQuery,
  UpdateNovelCommand,
} from './domain/ports';
import { NovelsController } from './infra/api/novels.controller';
import { NovelTypeormModule } from './infra/typeorm-repository/novel-typeorm.module';
import { NovelUserModule } from './infra/user-facade/novel-user.module';

@Module({
  imports: [NovelTypeormModule, NovelUserModule],
  controllers: [NovelsController],
  providers: [
    CreateNovelCommand,
    GetNovelQuery,
    GetAllNovelsQuery,
    DeleteAllNovelsCommand,
    UpdateNovelCommand,
  ],
  exports: [],
})
export class NovelsModule {}
