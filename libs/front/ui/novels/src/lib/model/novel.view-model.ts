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
    this.chapters.push(
      new NovelChaptersViewModel(uuidV4(), name, outline || '')
    );
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
