import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelSceneContentUpdatedTrackingEvent extends NovelBaseTrackingEvent<{
  chapterId: string;
  sceneId: string;
  wordsAdded: number;
}> {
  constructor(
    novelId: string,
    chapterId: string,
    sceneId: string,
    wordsAdded: number,
    userId: string
  ) {
    super(
      'novel.sceneContentUpdated',
      novelId,
      { chapterId, sceneId, wordsAdded },
      userId
    );
  }
}
