import { Inject, Injectable } from '@nestjs/common';
import { Novel } from '@owl/shared/novels/model';

import { NovelRepository } from '../../out';

@Injectable()
export class GetNovelQuery {
  constructor(
    @Inject(NovelRepository) private readonly novelRepository: NovelRepository
  ) {}

  async execute(novelId: string, userId: string): Promise<Novel | null> {
    return await this.novelRepository.getOne(novelId, userId);
  }
}
