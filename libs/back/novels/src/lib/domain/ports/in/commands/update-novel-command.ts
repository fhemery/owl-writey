import { Inject, Injectable } from '@nestjs/common';
import {
  Novel,
  NovelBuilder,
  NovelGeneralInfo,
} from '@owl/shared/novels/model';

import {
  NovelNotAuthorException,
  NovelNotFoundException,
} from '../../../model';
import { NovelRepository } from '../../out';

@Injectable()
export class UpdateNovelCommand {
  constructor(
    @Inject(NovelRepository)
    private readonly novelRepository: NovelRepository
  ) {}

  async execute(uid: string, novel: Novel): Promise<void> {
    const existingNovel = await this.novelRepository.getOne(novel.id, uid);
    if (!existingNovel) {
      throw new NovelNotFoundException(novel.id);
    }
    if (!existingNovel.isAuthor(uid)) {
      throw new NovelNotAuthorException(novel.id);
    }

    const novelToSave = NovelBuilder.Existing(
      novel.id,
      new NovelGeneralInfo(
        novel.generalInfo.title,
        novel.generalInfo.description
      )
    )
      .withParticipants(existingNovel.participants)
      .withChapters(novel.chapters)
      .withUniverse(novel.universe)
      .build();

    return this.novelRepository.save(novelToSave);
  }
}
