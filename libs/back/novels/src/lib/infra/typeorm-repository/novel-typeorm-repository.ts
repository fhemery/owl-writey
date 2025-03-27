import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Novel } from '../../domain/model';
import { NovelRepository } from '../../domain/ports';
import { NovelEntity } from './entities/novel.entity';
import { NovelContentEntity } from './entities/novel-content';
import { NovelParticipantEntity } from './entities/novel-participant.entity';

@Injectable()
export class NovelTypeormRepository implements NovelRepository {
  constructor(
    @InjectRepository(NovelEntity)
    private readonly repo: Repository<NovelEntity>,
    @InjectRepository(NovelParticipantEntity)
    private readonly participantRepo: Repository<NovelParticipantEntity>,
    @InjectRepository(NovelContentEntity)
    private readonly contentRepo: Repository<NovelContentEntity>
  ) {}

  async save(novel: Novel): Promise<void> {
    const entity = NovelEntity.From(novel);
    const contentEntity = NovelContentEntity.From(novel);

    await this.repo.save(entity);
    await this.contentRepo.save(contentEntity);
  }

  async getAll(userId: string): Promise<Novel[]> {
    const query = this.repo
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.participants', 'participant')
      .where('participant.participantUid = :userId', { userId });
    const entities = await query.getMany();
    return entities.map((e) => e.toNovel());
  }

  async getOne(novelId: string, userId: string): Promise<Novel | null> {
    const entity = await this.repo.findOne({
      where: { id: novelId },
      relations: ['participants'],
    });

    if (
      !entity ||
      !entity.participants.some((p) => p.participantUid === userId)
    ) {
      return null;
    }

    const content = await this.contentRepo.findOne({
      where: { novelId },
    });
    // This is a backwards compatible fix. Content do not exist for existing novel. They should soon.
    if (!content) {
      return entity.toNovel();
    }

    return content.toNovel(entity.participants);
  }

  async delete(novelId: string): Promise<void> {
    await this.participantRepo.delete({ novelId });
    await this.repo.delete({ id: novelId });
  }
}
