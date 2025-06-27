import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelSceneDeletedEventData {
  chapterId: string;
  sceneId: string;
}

export class NovelSceneDeletedEvent extends NovelBaseDomainEvent<NovelSceneDeletedEventData> {
  static readonly eventName = 'Novel:SceneDeleted';
  static readonly eventVersion = '1';

  constructor(
    data: NovelSceneDeletedEventData,
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
      NovelSceneDeletedEvent.eventName,
      NovelSceneDeletedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.deleteScene(this.data.chapterId, this.data.sceneId);
  }
}
