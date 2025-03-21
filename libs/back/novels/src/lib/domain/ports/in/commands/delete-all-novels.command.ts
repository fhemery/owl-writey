import { Inject, Injectable } from '@nestjs/common';

import { NovelRepository } from '../../out';

@Injectable()
export class DeleteAllNovelsCommand {
  constructor(
    @Inject(NovelRepository) private readonly novelRepository: NovelRepository
  ) {}

  async execute(uid: string): Promise<void> {
    const novels = await this.novelRepository.getAll(uid);
    for (const novel of novels) {
      await this.novelRepository.delete(novel.id);
    }
  }
}
