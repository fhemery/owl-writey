import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelSceneTitleUpdatedEventData {
  chapterId: string;
  sceneId: string;
  title: string;
}

export class NovelSceneTitleUpdatedEvent extends NovelBaseDomainEvent<NovelSceneTitleUpdatedEventData> {
  static eventName = 'Novel:SceneTitleUpdated';
  static eventVersion = '1';

  constructor(
    data: NovelSceneTitleUpdatedEventData,
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

    if (!data.title?.trim()) {
      throw new NovelException('Scene title must be provided');
    }

    super(
      eventId,
      NovelSceneTitleUpdatedEvent.eventName,
      NovelSceneTitleUpdatedEvent.eventVersion,
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
      scene.withTitle(this.data.title)
    );
  }
}
