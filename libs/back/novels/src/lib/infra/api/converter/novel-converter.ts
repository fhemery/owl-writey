import { NovelDto } from '@owl/shared/contracts';

import { Novel } from '../../../domain/model';

export const novelConverter = {
  toNovel: (novel: Novel): NovelDto => {
    return {
      id: novel.id,
      title: novel.generalInfo.title,
      description: novel.generalInfo.description,
      chapters: [],
    };
  },
};
