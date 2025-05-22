import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelChapterDeletedEventData {
  id: string;
}

export class NovelChapterDeletedEvent extends NovelBaseDomainEvent<NovelChapterDeletedEventData> {
  static readonly eventName = 'Novel:ChapterDeleted';
  static readonly eventVersion = '1';

  constructor(
    data: NovelChapterDeletedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.id) {
      throw new NovelException('Id of chapter must be provided');
    }

    super(
      eventId,
      NovelChapterDeletedEvent.eventName,
      NovelChapterDeletedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.deleteChapter(this.data.id);
  }
}
