import { NovelException } from './exceptions/novel.exception';

export class NovelGeneralInfo {
  constructor(readonly title: string, readonly description: string) {
    if (title.trim().length < 3) {
      throw new NovelException('Title must be at least 3 characters long');
    }
  }

  copy(): NovelGeneralInfo {
    return new NovelGeneralInfo(this.title, this.description);
  }

  withTitle(title: string): NovelGeneralInfo {
    return new NovelGeneralInfo(title, this.description);
  }
  withDescription(description: string): NovelGeneralInfo {
    return new NovelGeneralInfo(this.title, description);
  }
}
