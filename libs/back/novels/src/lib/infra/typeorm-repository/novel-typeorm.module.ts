import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NovelRepository } from '../../domain/ports';
import { NovelEntity } from './entities/novel.entity';
import { NovelParticipantEntity } from './entities/novel-participant.entity';
import { NovelTypeormRepository } from './novel-typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([NovelEntity, NovelParticipantEntity])],
  providers: [{ provide: NovelRepository, useClass: NovelTypeormRepository }],
  exports: [NovelRepository],
})
export class NovelTypeormModule {}
