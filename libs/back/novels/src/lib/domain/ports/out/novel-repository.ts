import { Novel } from '../../model';

export const NovelRepository = Symbol('NovelRepository');
export interface NovelRepository {
  getOne(novelId: string, userId: string): Promise<Novel | null>;
  getAll(userId: string): Promise<Novel[]>;
  save(novel: Novel): Promise<void>;
  delete(novelId: string): Promise<void>;
}
