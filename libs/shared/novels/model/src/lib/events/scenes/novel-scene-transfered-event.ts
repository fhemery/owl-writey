import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelSceneTransferedEventData {
  initialChapterId: string;
  sceneId: string;
  targetChapterId: string;
  at: number;
}
export class NovelSceneTransferedEvent extends NovelBaseDomainEvent<NovelSceneTransferedEventData> {
  static eventName = 'Novel:SceneTransfered';
  static eventVersion = '1';

  constructor(
    data: NovelSceneTransferedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.initialChapterId) {
      throw new NovelException('Initial chapter ID must be provided');
    }

    if (!data.sceneId) {
      throw new NovelException('Scene ID must be provided');
    }

    if (!data.targetChapterId) {
      throw new NovelException('Target chapter ID must be provided');
    }

    if (data.at === undefined || data.at < 0) {
      throw new NovelException('New position must be provided');
    }

    super(
      eventId,
      NovelSceneTransferedEvent.eventName,
      NovelSceneTransferedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.transferScene(
      this.data.initialChapterId,
      this.data.sceneId,
      this.data.targetChapterId,
      this.data.at
    );
  }
}
