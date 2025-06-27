import { applyTextDiff, TextDiff } from '@owl/shared/word-utils';

import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelSceneContentUpdatedEventData {
  chapterId: string;
  sceneId: string;
  diff: TextDiff;
}

export class NovelSceneContentUpdatedEvent extends NovelBaseDomainEvent<NovelSceneContentUpdatedEventData> {
  static eventName = 'Novel:SceneContentUpdated';
  static eventVersion = '1';

  constructor(
    data: NovelSceneContentUpdatedEventData,
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

    if (!data.diff) {
      throw new NovelException('Scene diff must be provided');
    }

    super(
      eventId,
      NovelSceneContentUpdatedEvent.eventName,
      NovelSceneContentUpdatedEvent.eventVersion,
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
      scene.withContent(applyTextDiff(scene.content, this.data.diff))
    );
  }
}
