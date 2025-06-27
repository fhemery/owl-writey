import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelChapterMovedEventData {
  id: string;
  atIndex: number;
}

export class NovelChapterMovedEvent extends NovelBaseDomainEvent<NovelChapterMovedEventData> {
  static readonly eventName = 'Novel:ChapterMoved';
  static readonly eventVersion = '1';

  constructor(
    data: NovelChapterMovedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.id) {
      throw new NovelException('Id of chapter must be provided');
    }
    if (data.atIndex === undefined || data.atIndex < 0) {
      throw new NovelException('Index of chapter must be provided');
    }

    super(
      eventId,
      NovelChapterMovedEvent.eventName,
      NovelChapterMovedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.moveChapter(this.data.id, this.data.atIndex);
  }
}
