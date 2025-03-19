import { Module } from '@nestjs/common';
import { UsersModule } from '@owl/back/user';

import {
  CreateNovelCommand,
  DeleteAllNovelsCommand,
  GetAllNovelsQuery,
  GetNovelQuery,
} from './domain/ports';
import { NovelsController } from './infra/api/novels.controller';
import { NovelMysqlModule } from './infra/mysql-repository/novel-mysql.module';

@Module({
  imports: [UsersModule, NovelMysqlModule, NovelMysqlModule],
  controllers: [NovelsController],
  providers: [
    CreateNovelCommand,
    GetNovelQuery,
    GetAllNovelsQuery,
    DeleteAllNovelsCommand,
  ],
  exports: [],
})
export class NovelsModule {}
