import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelSceneMovedData {
  chapterId: string;
  sceneId: string;
  at: number;
}

export class NovelSceneMovedEvent extends NovelBaseDomainEvent<NovelSceneMovedData> {
  static readonly eventName = 'Novel:SceneMoved';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelSceneMovedEvent {
    return new NovelSceneMovedEvent(
      data as NovelSceneMovedData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    data: NovelSceneMovedData,
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

    if (data.at === undefined || data.at < 0) {
      throw new NovelException('New position must be provided');
    }

    super(
      eventId,
      NovelSceneMovedEvent.eventName,
      NovelSceneMovedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.doMoveScene(
      this.data.chapterId,
      this.data.sceneId,
      this.data.at
    );
  }
}
