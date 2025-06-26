import { NovelRole } from '@owl/shared/novels/contracts';

export class NovelParticipant {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: NovelRole
  ) {}
}
