import { Inject, Injectable } from '@nestjs/common';
import { NovelBaseDomainEvent } from '@owl/shared/novels/model';

import { NovelNotFoundException } from '../../../model';
import { NovelRepository } from '../../out';

@Injectable()
export class GetNovelEventsQuery {
  constructor(
    @Inject(NovelRepository)
    private readonly novelRepository: NovelRepository
  ) {}

  async execute(
    novelId: string,
    userId: string
  ): Promise<NovelBaseDomainEvent[]> {
    const hasNovel = await this.novelRepository.exists(novelId, userId);
    if (!hasNovel) {
      throw new NovelNotFoundException(novelId);
    }
    const events = await this.novelRepository.getEvents(novelId);
    return events;
  }
}
