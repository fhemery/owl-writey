import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

interface NovelTitleChangedEventData {
  title: string;
}

export class NovelTitleChangedEvent extends NovelBaseDomainEvent<NovelTitleChangedEventData> {
  static readonly eventName = 'Novel:TitleChanged';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelTitleChangedEvent {
    const title = (data as NovelTitleChangedEventData)?.title;
    if (!title) {
      throw new NovelException(
        `While parsing NovelTitleChangedEvent: Missing title in data ${data}`
      );
    }
    return new NovelTitleChangedEvent(
      title,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    title: string,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    super(
      eventId,
      NovelTitleChangedEvent.eventName,
      NovelTitleChangedEvent.eventVersion,
      userId,
      {
        title,
      },
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.updateTitle(this.data.title);
  }
}
