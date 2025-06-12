import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelSceneNotesUpdatedEventData {
  chapterId: string;
  sceneId: string;
  notes: string;
}

export class NovelSceneNotesUpdatedEvent extends NovelBaseDomainEvent<NovelSceneNotesUpdatedEventData> {
  static eventName = 'Novel:SceneNotesUpdated';
  static eventVersion = '1';

  constructor(
    data: NovelSceneNotesUpdatedEventData,
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
      NovelSceneNotesUpdatedEvent.eventName,
      NovelSceneNotesUpdatedEvent.eventVersion,
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
      scene.withNotes(this.data.notes)
    );
  }
}
