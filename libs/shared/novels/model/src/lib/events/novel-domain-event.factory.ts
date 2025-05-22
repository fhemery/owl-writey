import { NovelBaseDomainEvent } from './novel-base-domain-event';
import { NovelChapterAddedEvent } from './novel-chapter-added-event';
import { NovelChapterDeletedEvent } from './novel-chapter-deleted-event';
import { NovelChapterMovedEvent } from './novel-chapter-moved-event';
import { NovelChapterOutlineUpdatedEvent } from './novel-chapter-outline-updated.event';
import { NovelChapterTitleUpdatedEvent } from './novel-chapter-title-updated.event';
import { NovelDescriptionChangedEvent } from './novel-description-changed-event';
import { NovelSceneAddedEvent } from './novel-scene-added-event';
import { NovelSceneDeletedEvent } from './novel-scene-deleted-event';
import { NovelSceneMovedEvent } from './novel-scene-moved-event';
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
      case NovelChapterDeletedEvent.eventName:
        return NovelChapterDeletedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterMovedEvent.eventName:
        return NovelChapterMovedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterTitleUpdatedEvent.eventName:
        return NovelChapterTitleUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterOutlineUpdatedEvent.eventName:
        return NovelChapterOutlineUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneAddedEvent.eventName:
        return NovelSceneAddedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneDeletedEvent.eventName:
        return NovelSceneDeletedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneMovedEvent.eventName:
        return NovelSceneMovedEvent.From(
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
