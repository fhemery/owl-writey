import { Novel } from '../../model';

export const NovelRepository = Symbol('NovelRepository');
export interface NovelRepository {
  getOne(novelId: string, userId: string): Promise<Novel | null>;
  save(novel: Novel): Promise<void>;
}
