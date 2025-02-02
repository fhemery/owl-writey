import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { Novel, NovelGeneralInfo, NovelToCreate } from '../../../model';
import { NovelRepository } from '../../out';

@Injectable()
export class CreateNovelCommand {
  constructor(
    @Inject(NovelRepository) private readonly novelRepository: NovelRepository
  ) {}

  async execute(novelToCreate: NovelToCreate): Promise<string> {
    const id = uuidV4();
    const novel = new Novel(
      id,
      new NovelGeneralInfo(
        novelToCreate.title,
        novelToCreate.description,
        novelToCreate.authorUid
      ),
      []
    );

    await this.novelRepository.save(novel);
    return id;
  }
}
