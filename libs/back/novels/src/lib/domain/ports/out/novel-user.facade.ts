import { NovelUser } from '../../model';

export const NovelUserFacade = Symbol('NovelUserFacade');
export interface NovelUserFacade {
  getOne(userId: string): Promise<NovelUser | null>;
}
