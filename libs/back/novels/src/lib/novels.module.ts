import { Module } from '@nestjs/common';
import { UsersModule } from '@owl/back/user';

import { CreateNovelCommand, GetNovelQuery } from './domain/ports';
import { NovelsController } from './infra/api/novels.controller';
import { NovelMysqlModule } from './infra/mysql-repository/novel-mysql.module';

@Module({
  imports: [UsersModule, NovelMysqlModule, NovelMysqlModule],
  controllers: [NovelsController],
  providers: [CreateNovelCommand, GetNovelQuery],
  exports: [],
})
export class NovelsModule {}
