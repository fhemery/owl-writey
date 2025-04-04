import { Inject, Injectable } from '@nestjs/common';

import {
  Novel,
  NovelGeneralInfo,
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

    const novelToSave = new Novel(
      novel.id,
      new NovelGeneralInfo(
        novel.generalInfo.title,
        novel.generalInfo.description,
        existingNovel.generalInfo.participants
      ),
      novel.chapters
    );

    return this.novelRepository.save(novelToSave);
  }
}
