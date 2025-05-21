import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

interface NovelChapterDeletedData {
  id: string;
}

export class NovelChapterDeletedEvent extends NovelBaseDomainEvent<NovelChapterDeletedData> {
  static readonly eventName = 'Novel:ChapterDeleted';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelChapterDeletedEvent {
    return new NovelChapterDeletedEvent(
      data as NovelChapterDeletedData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    data: NovelChapterDeletedData,
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
