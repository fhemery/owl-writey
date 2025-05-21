import { NovelBaseDomainEvent } from './novel-base-domain-event';
import { NovelDescriptionChangedEvent } from './novel-description-changed-event';
import { NovelTitleChangedEvent } from './novel-title-changed-event';

export class NovelDomainEventFactory {
  static From(
    eventName: string,
    eventVersion: string,
    data: unknown
  ): NovelBaseDomainEvent {
    switch (eventName) {
      case NovelTitleChangedEvent.eventName:
        return NovelTitleChangedEvent.From(data);
      case NovelDescriptionChangedEvent.eventName:
        return NovelDescriptionChangedEvent.From(data);
      default:
        throw new Error(`Unknown domain event name: ${eventName}`);
    }
  }
}
