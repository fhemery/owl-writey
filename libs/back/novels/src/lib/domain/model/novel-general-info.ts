import { NovelRole } from '@owl/shared/contracts';

export class NovelGeneralInfo {
  constructor(
    readonly title: string,
    readonly description = '',
    readonly participants: NovelParticipant[]
  ) {}
}

export class NovelParticipant {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: NovelRole
  ) {}
}
