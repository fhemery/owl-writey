import { NovelDto } from '@owl/shared/contracts';

import {
  Novel,
  NovelGeneralInfo,
  NovelParticipant,
} from '../../../domain/model';

export const novelConverter = {
  toNovelDto: (novel: Novel): NovelDto => {
    return {
      id: novel.id,
      title: novel.generalInfo.title,
      description: novel.generalInfo.description,
      participants: novel.generalInfo.participants.map((p) => ({
        uid: p.uid,
        name: p.name,
        role: p.role,
      })),
      chapters: [],
    };
  },
  toNovel: (novelDto: NovelDto): Novel => {
    return new Novel(
      novelDto.id,
      new NovelGeneralInfo(
        novelDto.title,
        novelDto.description,
        novelDto.participants.map(
          (p) => new NovelParticipant(p.uid, p.name, p.role)
        )
      ),
      []
    );
  },
};
