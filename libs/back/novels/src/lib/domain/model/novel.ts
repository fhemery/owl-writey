import { Chapter } from './chapter';
import { NovelGeneralInfo } from './novel-general-info';

export class Novel {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelGeneralInfo,
    readonly chapters: Chapter[]
  ) {}
}
