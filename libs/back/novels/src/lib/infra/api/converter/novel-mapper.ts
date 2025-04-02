import { NovelDto } from '@owl/shared/novels/contracts';

import {
  Chapter,
  ChapterGeneralInfo,
  Novel,
  NovelCharacter,
  NovelGeneralInfo,
  NovelParticipant,
  NovelUniverse,
  Scene,
  SceneGeneralInfo,
} from '../../../domain/model';

export const novelMapper = {
  toNovelDto: (novel: Novel): NovelDto => {
    return {
      id: novel.id,
      generalInfo: {
        title: novel.generalInfo.title,
        description: novel.generalInfo.description,
      },
      participants: novel.generalInfo.participants.map((p) => ({
        uid: p.uid,
        name: p.name,
        role: p.role,
      })),
      chapters: novel.chapters.map((c) => ({
        id: c.id,
        generalInfo: {
          title: c.generalInfo.title,
          outline: c.generalInfo.outline,
        },
        scenes: c.scenes.map((s) => ({
          id: s.id,
          generalInfo: {
            title: s.generalInfo.title,
            outline: s.generalInfo.outline,
            pointOfViewId: s.generalInfo.pointOfViewId,
          },
          content: s.text,
        })),
      })),
      universe: {
        characters: novel.universe.characters.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          tags: c.tags,
        })),
      },
    };
  },
  toNovel: (novelDto: NovelDto): Novel => {
    return new Novel(
      novelDto.id,
      new NovelGeneralInfo(
        novelDto.generalInfo.title,
        novelDto.generalInfo.description,
        novelDto.participants.map(
          (p) => new NovelParticipant(p.uid, p.name, p.role)
        )
      ),
      novelDto.chapters.map(
        (c) =>
          new Chapter(
            c.id,
            new ChapterGeneralInfo(c.generalInfo.title, c.generalInfo.outline),
            c.scenes.map(
              (s) =>
                new Scene(
                  s.id,
                  new SceneGeneralInfo(
                    s.generalInfo.title,
                    s.generalInfo.outline,
                    s.generalInfo.pointOfViewId
                  ),
                  s.content
                )
            )
          )
      ),
      new NovelUniverse(
        novelDto.universe?.characters.map(
          (c) => new NovelCharacter(c.id, c.name, c.description, c.tags)
        )
      )
    );
  },
};
