import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

interface NovelDescriptionChangedEventData {
  description: string;
}
export class NovelDescriptionChangedEvent extends NovelBaseDomainEvent<NovelDescriptionChangedEventData> {
  static readonly eventName = 'Novel:DescriptionChanged';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelDescriptionChangedEvent {
    const description = (data as NovelDescriptionChangedEventData)?.description;
    if (!description) {
      throw new NovelException(
        `While parsing NovelDescriptionChangedEvent: Missing description in data ${data}`
      );
    }
    return new NovelDescriptionChangedEvent(
      description,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    description: string,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    super(
      eventId,
      NovelDescriptionChangedEvent.eventName,
      NovelDescriptionChangedEvent.eventVersion,
      userId,
      {
        description,
      },
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.updateDescription(this.data.description);
  }
}
