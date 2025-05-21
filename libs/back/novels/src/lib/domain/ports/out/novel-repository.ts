import { Novel, NovelBaseDomainEvent } from '@owl/shared/novels/model';

export const NovelRepository = Symbol('NovelRepository');
export interface NovelRepository {
  exists(novelId: string, userId: string): Promise<boolean>;
  getEvents(novelId: string): Promise<NovelBaseDomainEvent[]>;
  pushEvents(novelId: string, events: NovelBaseDomainEvent[]): Promise<void>;
  getOne(novelId: string, userId: string): Promise<Novel | null>;
  getAll(userId: string): Promise<Novel[]>;
  save(novel: Novel): Promise<void>;
  delete(novelId: string): Promise<void>;
}
