import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

interface NovelChapterAddedEventData {
  id: string;
  name: string;
  outline?: string;
  at?: number;
}

export class NovelChapterAddedEvent extends NovelBaseDomainEvent<NovelChapterAddedEventData> {
  static readonly eventName = 'Novel:ChapterAdded';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelChapterAddedEvent {
    return new NovelChapterAddedEvent(
      data as NovelChapterAddedEventData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    data: NovelChapterAddedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.id) {
      throw new NovelException('Id of chapter must be provided');
    }
    if (!data.name.trim()) {
      throw new NovelException('Name of chapter must be non-empty');
    }

    super(
      eventId,
      NovelChapterAddedEvent.eventName,
      NovelChapterAddedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.addChapterAt(
      this.data.id,
      this.data.name,
      this.data.outline,
      this.data.at
    );
  }
}
