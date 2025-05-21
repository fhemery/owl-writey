import { NovelBaseDomainEvent } from './novel-base-domain-event';
import { NovelChapterAddedEvent } from './novel-chapter-added-event';
import { NovelDescriptionChangedEvent } from './novel-description-changed-event';
import { NovelTitleChangedEvent } from './novel-title-changed-event';

export class NovelDomainEventFactory {
  static From(
    eventName: string,
    eventVersion: string,
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelBaseDomainEvent {
    switch (eventName) {
      case NovelTitleChangedEvent.eventName:
        return NovelTitleChangedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelDescriptionChangedEvent.eventName:
        return NovelDescriptionChangedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterAddedEvent.eventName:
        return NovelChapterAddedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      default:
        throw new Error(`Unknown domain event name: ${eventName}`);
    }
  }
}
