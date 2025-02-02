import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NovelRepository } from '../../domain/ports';
import { NovelEntity } from './entities/novel.entity';
import { NovelMysqlRepository } from './novel-mysql-repository';

@Module({
  imports: [TypeOrmModule.forFeature([NovelEntity])],
  providers: [{ provide: NovelRepository, useClass: NovelMysqlRepository }],
  exports: [NovelRepository],
})
export class NovelMysqlModule {}
