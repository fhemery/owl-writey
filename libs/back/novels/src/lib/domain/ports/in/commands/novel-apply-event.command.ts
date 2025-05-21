import { Inject, Injectable } from '@nestjs/common';
import { NovelBaseDomainEvent } from '@owl/shared/novels/model';

import { NovelNotFoundException } from '../../../model';
import { NovelRepository } from '../../out';

@Injectable()
export class NovelApplyEventCommand {
  constructor(
    @Inject(NovelRepository)
    private readonly novelRepository: NovelRepository
  ) {}

  async execute(
    novelId: string,
    userId: string,
    event: NovelBaseDomainEvent
  ): Promise<void> {
    const novel = await this.novelRepository.getOne(novelId, userId);
    if (!novel) {
      throw new NovelNotFoundException(novelId);
    }
    const newNovel = event.applyTo(novel);
    await this.novelRepository.save(newNovel);

    // TODO : store the event
  }
}
