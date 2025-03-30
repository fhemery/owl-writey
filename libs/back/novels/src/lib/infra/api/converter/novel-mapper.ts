import { NovelDto } from '@owl/shared/novels/contracts';

import {
  Chapter,
  ChapterGeneralInfo,
  Novel,
  NovelGeneralInfo,
  NovelParticipant,
  Scene,
  SceneGeneralInfo,
} from '../../../domain/model';

export const novelMapper = {
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
      chapters: novel.chapters.map((c) => ({
        id: c.id,
        title: c.generalInfo.title,
        outline: c.generalInfo.outline,
        scenes: c.scenes.map((s) => ({
          id: s.id,
          title: s.generalInfo.title,
          outline: s.generalInfo.outline,
          content: s.text,
        })),
      })),
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
      novelDto.chapters.map(
        (c) =>
          new Chapter(
            c.id,
            new ChapterGeneralInfo(c.title, c.outline),
            c.scenes.map(
              (s) =>
                new Scene(
                  s.id,
                  new SceneGeneralInfo(s.title, s.outline),
                  s.content
                )
            )
          )
      )
    );
  },
};
