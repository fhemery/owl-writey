import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelSceneDeletedTrackingEvent extends NovelBaseTrackingEvent<{
  chapterId: string;
  sceneId: string;
}> {
  constructor(
    novelId: string,
    chapterId: string,
    sceneId: string,
    userId: string
  ) {
    super('novel.sceneDeleted', novelId, { chapterId, sceneId }, userId);
  }
}
