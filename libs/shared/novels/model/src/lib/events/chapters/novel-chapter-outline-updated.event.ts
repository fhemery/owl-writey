import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelChapterOutlineUpdatedEventData {
  id: string;
  outline: string;
}

export class NovelChapterOutlineUpdatedEvent extends NovelBaseDomainEvent {
  static readonly eventName = 'NovelChapterOutlineUpdated';
  static readonly eventVersion = '1';

  constructor(
    public override readonly data: NovelChapterOutlineUpdatedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.id) {
      throw new NovelException('Chapter ID is required');
    }

    if (data.outline === undefined) {
      throw new NovelException('Chapter outline must be provided');
    }

    super(
      eventId,
      NovelChapterOutlineUpdatedEvent.eventName,
      NovelChapterOutlineUpdatedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    const chapter = novel.findChapter(this.data.id);

    if (!chapter) {
      return novel;
    }

    return novel.updateChapter(chapter.updateOutline(this.data.outline));
  }
}
