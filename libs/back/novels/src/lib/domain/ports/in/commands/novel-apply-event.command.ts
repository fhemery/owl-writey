import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';
import { NovelBaseDomainEvent } from '@owl/shared/novels/model';

import { NovelUpdatedEvent } from '../../../events';
import { NovelNotFoundException } from '../../../model';
import { NovelRepository } from '../../out';

@Injectable()
export class NovelApplyEventCommand {
  constructor(
    @Inject(NovelRepository)
    private readonly novelRepository: NovelRepository,
    @Inject(EventEmitterFacade)
    private readonly eventEmitterFacade: EventEmitterFacade
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

    await this.novelRepository.pushEvents(novelId, [event]);
    this.eventEmitterFacade.emit(new NovelUpdatedEvent({ novel, event }));
  }
}
