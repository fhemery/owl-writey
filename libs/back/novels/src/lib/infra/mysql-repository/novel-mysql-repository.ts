import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Novel } from '../../domain/model';
import { NovelRepository } from '../../domain/ports';
import { NovelEntity } from './entities/novel.entity';

@Injectable()
export class NovelMysqlRepository implements NovelRepository {
  constructor(
    @InjectRepository(NovelEntity)
    private readonly repo: Repository<NovelEntity>
  ) {}

  async save(novel: Novel): Promise<void> {
    const entity = NovelEntity.From(novel);

    await this.repo.save(entity);
  }

  async getOne(novelId: string, userId: string): Promise<Novel | null> {
    const entity = await this.repo.findOneBy({
      id: novelId,
      authorUid: userId,
    });

    if (!entity) {
      return null;
    }

    return entity.toNovel();
  }
}
