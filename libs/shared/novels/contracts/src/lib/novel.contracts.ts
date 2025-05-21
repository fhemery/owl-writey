import { SseEvent } from '@owl/shared/common/contracts';

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
  properties: NovelCharacterPropertiesDto;
}

export interface NovelCharacterPropertiesDto {
  color?: string;
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

export interface NovelEventToPushDto {
  eventId: string;
  eventName: string;
  eventVersion: string;
  data: unknown;
}

export interface NovelEventDto {
  eventId: string;
  eventName: string;
  eventVersion: string;
  userId: string;
  eventSequentialId?: number;
  data: unknown;
}

export class NovelSseEvent extends SseEvent<NovelEventDto[]> {
  static readonly eventName = 'novelEvent';
  constructor(events: NovelEventDto[]) {
    super(NovelSseEvent.eventName, events);
  }
}
