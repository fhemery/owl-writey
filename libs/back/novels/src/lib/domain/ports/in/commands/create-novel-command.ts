import { Inject, Injectable } from '@nestjs/common';
import { NovelRole } from '@owl/shared/contracts';
import { v4 as uuidV4 } from 'uuid';

import {
  Novel,
  NovelGeneralInfo,
  NovelParticipant,
  NovelToCreate,
} from '../../../model';
import { NovelRepository, NovelUserFacade } from '../../out';

@Injectable()
export class CreateNovelCommand {
  constructor(
    @Inject(NovelRepository) private readonly novelRepository: NovelRepository,
    @Inject(NovelUserFacade) private readonly novelUserFacade: NovelUserFacade
  ) {}

  async execute(novelToCreate: NovelToCreate): Promise<string> {
    const id = uuidV4();
    const user = await this.novelUserFacade.getOne(novelToCreate.authorUid);

    if (!user) {
      throw new Error('User not found');
    }

    const novel = new Novel(
      id,
      new NovelGeneralInfo(novelToCreate.title, novelToCreate.description, [
        new NovelParticipant(user.uid, user.name, NovelRole.Author),
      ]),
      []
    );

    await this.novelRepository.save(novel);
    return id;
  }
}
