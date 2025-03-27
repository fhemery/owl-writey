import { ChapterGeneralInfo } from './chapter-general-info';
import { Scene } from './scene';

export class Chapter {
  constructor(
    readonly id: string,
    readonly generalInfo: ChapterGeneralInfo,
    readonly scenes: Scene[]
  ) {}
}
