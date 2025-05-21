import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelSceneAddedEventData {
  chapterId: string;
  sceneId: string;
  title: string;
  outline: string;
  at?: number;
}

export class NovelSceneAddedEvent extends NovelBaseDomainEvent {
  static readonly eventName = 'Novel:SceneAdded';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelSceneAddedEvent {
    const eventData = data as NovelSceneAddedEventData;

    return new NovelSceneAddedEvent(
      eventData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    public override readonly data: NovelSceneAddedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.chapterId) {
      throw new NovelException('Chapter ID is required');
    }

    if (!data.sceneId) {
      throw new NovelException('Scene ID is required');
    }

    if (!data.title) {
      throw new NovelException('Scene title is required');
    }

    super(
      eventId,
      NovelSceneAddedEvent.eventName,
      NovelSceneAddedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.addSceneAt(
      this.data.chapterId,
      this.data.sceneId,
      this.data.title,
      this.data.outline,
      this.data.at
    );
  }
}
