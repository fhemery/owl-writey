export interface NovelToCreateDto {
  title: string;
  description: string;
}

export enum NovelRole {
  Author = 'Author',
}

export interface NovelSummaryDto {
  id: string;
  title: string;
  description: string;
}

export interface NovelDto {
  id: string;
  generalInfo: NovelGeneralInfoDto;
  participants: NovelParticipantDto[];
  chapters: ChapterDto[];
  universe?: NovelUniverseDto;
}

export interface NovelGeneralInfoDto {
  title: string;
  description: string;
}

export interface NovelUniverseDto {
  characters: NovelCharacterDto[];
}

export interface NovelCharacterDto {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface NovelParticipantDto {
  uid: string;
  name: string;
  role: NovelRole;
}

export interface ChapterDto {
  id: string;
  generalInfo: ChapterGeneralInfoDto;
  scenes: SceneDto[];
}

export interface ChapterGeneralInfoDto {
  title: string;
  outline: string;
}

export interface SceneDto {
  id: string;
  generalInfo: SceneGeneralInfoDto;
  content: string;
}

export interface SceneGeneralInfoDto {
  title: string;
  outline: string;
  pointOfViewId?: string;
}

export interface GetAllNovelsResponseDto {
  data: NovelSummaryDto[];
}
