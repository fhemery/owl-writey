import { NovelRole } from '@owl/shared/novels/contracts';
import { v4 as uuidV4 } from 'uuid';

export class NovelViewModel {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelGeneralInfoViewModel,
    readonly participants: NovelParticipantViewModel[],
    readonly chapters: NovelChaptersViewModel[]
  ) {}

  addChapterAt(name: string, outline = '', index?: number): void {
    if (index !== undefined) {
      this.chapters.splice(
        index,
        0,
        new NovelChaptersViewModel(uuidV4(), name, outline || '')
      );
    } else {
      this.chapters.push(
        new NovelChaptersViewModel(uuidV4(), name, outline || '')
      );
    }
  }
  updateChapter(chapter: NovelChaptersViewModel): void {
    const index = this.chapters.findIndex((c) => c.id === chapter.id);
    if (index !== -1) {
      this.chapters.splice(index, 1, chapter);
    }
  }
}

export class NovelGeneralInfoViewModel {
  constructor(readonly title: string, readonly description: string) {}
}

export class NovelParticipantViewModel {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: NovelRole
  ) {}
}

export class NovelChaptersViewModel {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly outline: string
  ) {}
}
