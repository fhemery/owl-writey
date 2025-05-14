import { Chapter } from './chapter';
import { NovelGeneralInfo } from './novel-general-info';
import { NovelUniverse } from './novel-universe';

export class Novel {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelGeneralInfo,
    readonly chapters: Chapter[],
    readonly universe: NovelUniverse
  ) {}

  isAuthor(uid: string): boolean {
    return this.generalInfo.isAuthor(uid);
  }
}
