import { NovelRole } from '@owl/shared/novels/contracts';

export class NovelViewModel {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelGeneralInfoViewModel,
    readonly participants: NovelParticipantViewModel[],
    readonly chapters: NovelChaptersViewModel[]
  ) {}
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
