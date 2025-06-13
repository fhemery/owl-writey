import { NovelRole } from '@owl/shared/novels/contracts';

import { NovelException } from '../exceptions/novel.exception';
import { NovelParticipant } from './novel-participant';

export class NovelParticipants {
  private _participants: NovelParticipant[];
  constructor(_participants: NovelParticipant[] = []) {
    if (!this.hasAtLeastOneAuthor(_participants)) {
      throw new NovelException('Novel must have at least one author');
    }
    this._participants = _participants;
  }

  get participants(): NovelParticipant[] {
    return [...this._participants];
  }

  hasParticipant(uid: string): boolean {
    return this._participants.some((p) => p.uid === uid);
  }
  isAuthor(uid: string): boolean {
    return this._participants.some(
      (p) => p.uid === uid && p.role === NovelRole.Author
    );
  }
  copy(): NovelParticipants {
    return new NovelParticipants([...this._participants]);
  }
  private hasAtLeastOneAuthor(participants: NovelParticipant[]): boolean {
    return participants.some((p) => p.role === NovelRole.Author);
  }
}
