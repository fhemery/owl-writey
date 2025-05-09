import { Inject, Injectable } from '@nestjs/common';
import { Novel } from '@owl/shared/novels/model';

import { NovelRepository } from '../../out';

@Injectable()
export class GetAllNovelsQuery {
  constructor(
    @Inject(NovelRepository) private readonly novelRepository: NovelRepository
  ) {}

  async execute(userId: string): Promise<Novel[]> {
    return await this.novelRepository.getAll(userId);
  }
}
