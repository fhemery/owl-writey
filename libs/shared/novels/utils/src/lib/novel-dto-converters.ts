import {
  ChapterDto,
  ChapterGeneralInfoDto,
  NovelCharacterDto,
  NovelDto,
  NovelGeneralInfoDto,
  NovelParticipantDto,
  NovelUniverseDto,
  SceneDto,
  SceneGeneralInfoDto,
} from '@owl/shared/novels/contracts';
import {
  Novel,
  NovelBuilder,
  NovelChapter,
  NovelChapterGeneralInfo,
  NovelCharacter,
  NovelGeneralInfo,
  NovelParticipant,
  NovelScene,
  NovelSceneGeneralInfo,
  NovelUniverse,
} from '@owl/shared/novels/model';

export const toNovelDto = (novel: Novel): NovelDto => {
  return {
    id: novel.id,
    generalInfo: toNovelGeneralInfoDto(novel.generalInfo),
    participants: toNovelParticipantsDto(novel.participants),
    chapters: toNovelChaptersDto(novel.chapters),
    universe: toNovelUniverseDto(novel.universe),
  };
};

export const toNovel = (novelDto: NovelDto): Novel => {
  return NovelBuilder.Existing(
    novelDto.id,
    toNovelGeneralInfo(novelDto.generalInfo)
  )
    .withParticipants(toNovelParticipants(novelDto.participants))
    .withChapters(toNovelChapters(novelDto.chapters))
    .withUniverse(toNovelUniverse(novelDto.universe))
    .build();
};

function toNovelGeneralInfo(
  generalInfoDto: NovelGeneralInfoDto
): NovelGeneralInfo {
  return new NovelGeneralInfo(generalInfoDto.title, generalInfoDto.description);
}

function toNovelParticipants(
  participantsDto: NovelParticipantDto[]
): NovelParticipant[] {
  return participantsDto.map(
    (p) => new NovelParticipant(p.uid, p.name, p.role)
  );
}

function toNovelChapters(chaptersDto: ChapterDto[]): NovelChapter[] {
  return chaptersDto.map(
    (c) =>
      new NovelChapter(
        c.id,
        toNovelChapterGeneralInfo(c.generalInfo),
        toNovelScenes(c.scenes)
      )
  );
}

function toNovelChapterGeneralInfo(
  generalInfoDto: ChapterGeneralInfoDto
): NovelChapterGeneralInfo {
  return new NovelChapterGeneralInfo(
    generalInfoDto.title,
    generalInfoDto.outline
  );
}

function toNovelScenes(scenesDto: SceneDto[]): NovelScene[] {
  return scenesDto.map(
    (s) =>
      new NovelScene(s.id, toNovelSceneGeneralInfo(s.generalInfo), s.content)
  );
}

function toNovelSceneGeneralInfo(
  generalInfoDto: SceneGeneralInfoDto
): NovelSceneGeneralInfo {
  return new NovelSceneGeneralInfo(
    generalInfoDto.title,
    generalInfoDto.outline,
    generalInfoDto.pointOfViewId
  );
}

function toNovelUniverse(universeDto?: NovelUniverseDto): NovelUniverse {
  if (!universeDto) {
    return new NovelUniverse();
  }
  return new NovelUniverse(toNovelCharacters(universeDto.characters));
}

function toNovelCharacters(
  charactersDto: NovelCharacterDto[]
): NovelCharacter[] {
  return charactersDto.map(
    (c) => new NovelCharacter(c.id, c.name, c.description, c.tags)
  );
}

function toNovelGeneralInfoDto(
  generalInfo: NovelGeneralInfo
): NovelGeneralInfoDto {
  return {
    title: generalInfo.title,
    description: generalInfo.description,
  };
}

function toNovelParticipantsDto(
  participants: NovelParticipant[]
): NovelParticipantDto[] {
  return participants.map((p) => ({
    uid: p.uid,
    name: p.name,
    role: p.role,
  }));
}

function toNovelChaptersDto(chapters: NovelChapter[]): ChapterDto[] {
  return chapters.map((c) => ({
    id: c.id,
    generalInfo: toNovelChapterGeneralInfoDto(c.generalInfo),
    scenes: toNovelScenesDto(c.scenes),
  }));
}

function toNovelChapterGeneralInfoDto(
  generalInfo: NovelChapterGeneralInfo
): ChapterGeneralInfoDto {
  return {
    title: generalInfo.title,
    outline: generalInfo.outline,
  };
}

function toNovelScenesDto(scenes: NovelScene[]): SceneDto[] {
  return scenes.map((s) => ({
    id: s.id,
    generalInfo: toNovelSceneGeneralInfoDto(s.generalInfo),
    content: s.content,
  }));
}

function toNovelSceneGeneralInfoDto(
  generalInfo: NovelSceneGeneralInfo
): SceneGeneralInfoDto {
  return {
    title: generalInfo.title,
    outline: generalInfo.outline,
    pointOfViewId: generalInfo.pov,
  };
}

function toNovelUniverseDto(universe: NovelUniverse): NovelUniverseDto {
  return {
    characters: universe.characters.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      tags: c.tags,
    })),
  };
}
