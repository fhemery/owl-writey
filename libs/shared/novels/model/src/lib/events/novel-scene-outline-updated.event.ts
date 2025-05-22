import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelSceneOutlineUpdatedEventData {
  chapterId: string;
  sceneId: string;
  outline: string;
}

export class NovelSceneOutlineUpdatedEvent extends NovelBaseDomainEvent<NovelSceneOutlineUpdatedEventData> {
  static eventName = 'Novel:SceneOutlineUpdated';
  static eventVersion = '1.0.0';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelSceneOutlineUpdatedEvent {
    return new NovelSceneOutlineUpdatedEvent(
      data as NovelSceneOutlineUpdatedEventData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    data: NovelSceneOutlineUpdatedEventData,
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

    if (data.outline === undefined) {
      throw new NovelException('Scene outline must be provided');
    }

    super(
      eventId,
      NovelSceneOutlineUpdatedEvent.eventName,
      NovelSceneOutlineUpdatedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    const scene = novel.findScene(this.data.chapterId, this.data.sceneId);
    if (!scene) {
      return novel;
    }
    return novel.updateScene(
      this.data.chapterId,
      scene.updateOutline(this.data.outline)
    );
  }
}
