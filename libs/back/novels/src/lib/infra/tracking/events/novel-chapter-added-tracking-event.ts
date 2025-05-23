import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelChapterAddedTrackingEvent extends NovelBaseTrackingEvent<{
  id: string;
  title: string;
}> {
  constructor(novelId: string, title: string, id: string, userId: string) {
    super('novel.chapterAdded', novelId, { id, title }, userId);
  }
}
