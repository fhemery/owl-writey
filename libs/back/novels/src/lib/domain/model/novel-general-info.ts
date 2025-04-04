import { NovelRole } from '@owl/shared/novels/contracts';

import { NovelParticipant } from './novel-participant';

export class NovelGeneralInfo {
  constructor(
    readonly title: string,
    readonly description = '',
    readonly participants: NovelParticipant[]
  ) {}

  isAuthor(uid: string): boolean {
    return this.participants.some(
      (p) => p.uid === uid && p.role === NovelRole.Author
    );
  }
}
