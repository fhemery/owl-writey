import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelSceneAddedTrackingEvent extends NovelBaseTrackingEvent<{
  chapterId: string;
  sceneId: string;
}> {
  constructor(
    novelId: string,
    chapterId: string,
    sceneId: string,
    userId: string
  ) {
    super('novel.sceneAdded', novelId, { chapterId, sceneId }, userId);
  }
}
