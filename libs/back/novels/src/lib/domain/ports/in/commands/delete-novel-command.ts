import { Inject, Injectable } from '@nestjs/common';

import { NovelNotFoundException } from '../../../model';
import { NovelRepository } from '../../out';

@Injectable()
export class DeleteNovelCommand {
  constructor(
    @Inject(NovelRepository)
    private readonly novelRepository: NovelRepository
  ) {}

  async execute(userId: string, novelId: string): Promise<void> {
    const novel = await this.novelRepository.getOne(novelId, userId);
    if (!novel || !novel.isAuthor(userId)) {
      throw new NovelNotFoundException(novelId);
    }

    await this.novelRepository.delete(novelId);
  }
}
