import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelDeletedTrackingEvent extends NovelBaseTrackingEvent<object> {
  constructor(novelId: string, userId: string) {
    super('novel.deleted', novelId, {}, userId);
  }
}
