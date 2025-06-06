import { NovelException } from '../exceptions/novel.exception';

export class NovelChapterGeneralInfo {
  constructor(readonly title: string, readonly outline = '') {
    if (!title?.trim().length) {
      throw new NovelException('Title of chapter must be provided');
    }
  }
  withTitle(title: string): NovelChapterGeneralInfo {
    return new NovelChapterGeneralInfo(title, this.outline);
  }
  
  withOutline(outline: string): NovelChapterGeneralInfo {
    return new NovelChapterGeneralInfo(this.title, outline);
  }
}
