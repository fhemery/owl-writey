import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelScenePovUpdatedEventData {
  chapterId: string;
  sceneId: string;
  povId?: string;
}

export class NovelScenePovUpdatedEvent extends NovelBaseDomainEvent<NovelScenePovUpdatedEventData> {
  static eventName = 'Novel:ScenePovUpdated';
  static eventVersion = '1';

  constructor(
    data: NovelScenePovUpdatedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.chapterId) {
      throw new NovelException('Chapter ID must be provided');
    }

    if (!data.sceneId) {
      throw new NovelException('Scene ID must be provided');
    }

    super(
      eventId,
      NovelScenePovUpdatedEvent.eventName,
      NovelScenePovUpdatedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.updateScenePov(
      this.data.chapterId,
      this.data.sceneId,
      this.data.povId
    );
  }
}
