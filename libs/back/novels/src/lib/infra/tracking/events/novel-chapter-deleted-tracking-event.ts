import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelChapterDeletedTrackingEvent extends NovelBaseTrackingEvent<{
  chapterId: string;
}> {
  constructor(novelId: string, chapterId: string, userId: string) {
    super('novel.chapterDeleted', novelId, { chapterId }, userId);
  }
}
