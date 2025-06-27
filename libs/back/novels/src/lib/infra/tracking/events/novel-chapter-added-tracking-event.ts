import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelChapterAddedTrackingEvent extends NovelBaseTrackingEvent<{
  chapterId: string;
}> {
  constructor(novelId: string, chapterId: string, userId: string) {
    super('novel.chapterAdded', novelId, { chapterId }, userId);
  }
}
