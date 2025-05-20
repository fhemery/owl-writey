import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';
import { NovelBuilder } from '@owl/shared/novels/model';

import { NovelCreateEvent } from '../../../events';
import { NovelToCreate } from '../../../model';
import { NovelRepository, NovelUserFacade } from '../../out';

@Injectable()
export class CreateNovelCommand {
  constructor(
    @Inject(NovelRepository) private readonly novelRepository: NovelRepository,
    @Inject(NovelUserFacade) private readonly novelUserFacade: NovelUserFacade,
    private readonly eventEmitter: EventEmitterFacade
  ) {}

  async execute(novelToCreate: NovelToCreate): Promise<string> {
    const user = await this.novelUserFacade.getOne(novelToCreate.authorUid);

    if (!user) {
      throw new Error('User not found');
    }

    const novel = NovelBuilder.New(
      novelToCreate.title,
      novelToCreate.description,
      user.uid,
      user.name
    ).build();
    await this.novelRepository.save(novel);

    // Emit novel created event
    this.eventEmitter.emit(new NovelCreateEvent(novel));

    return novel.id;
  }
}
