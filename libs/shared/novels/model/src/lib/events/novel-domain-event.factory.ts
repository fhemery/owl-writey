import { NovelBaseDomainEvent } from './novel-base-domain-event';
import { NovelChapterAddedEvent, NovelChapterAddedEventData } from './novel-chapter-added-event';
import { NovelChapterDeletedEvent, NovelChapterDeletedEventData } from './novel-chapter-deleted-event';
import { NovelChapterMovedEvent, NovelChapterMovedEventData } from './novel-chapter-moved-event';
import { NovelChapterOutlineUpdatedEvent, NovelChapterOutlineUpdatedEventData } from './novel-chapter-outline-updated.event';
import { NovelChapterTitleUpdatedEvent, NovelChapterTitleUpdatedEventData } from './novel-chapter-title-updated.event';
import { NovelCharacterAddedEvent, NovelCharacterAddedEventData } from './novel-character-added-event';
import { NovelCharacterColorUpdatedEvent, NovelCharacterColorUpdatedEventData } from './novel-character-color-updated.event';
import { NovelCharacterDeletedEvent, NovelCharacterDeletedEventData } from './novel-character-deleted-event';
import { NovelCharacterDescriptionUpdatedEvent, NovelCharacterDescriptionUpdatedEventData } from './novel-character-description-updated.event';
import { NovelCharacterMovedEvent, NovelCharacterMovedEventData } from './novel-character-moved-event';
import { NovelCharacterNameUpdatedEvent, NovelCharacterNameUpdatedEventData } from './novel-character-name-updated.event';
import { NovelCharacterTagsUpdatedEvent, NovelCharacterTagsUpdatedEventData } from './novel-character-tags-updated.event';
import { NovelDescriptionChangedEvent, NovelDescriptionChangedEventData } from './novel-description-changed-event';
import { NovelSceneAddedEvent, NovelSceneAddedEventData } from './novel-scene-added-event';
import { NovelSceneContentUpdatedEvent, NovelSceneContentUpdatedEventData } from './novel-scene-content-updated.event';
import { NovelSceneDeletedEvent, NovelSceneDeletedEventData } from './novel-scene-deleted-event';
import { NovelSceneMovedEvent, NovelSceneMovedEventData } from './novel-scene-moved-event';
import { NovelSceneOutlineUpdatedEvent, NovelSceneOutlineUpdatedEventData } from './novel-scene-outline-updated.event';
import { NovelScenePovUpdatedEvent, NovelScenePovUpdatedEventData } from './novel-scene-pov-updated.event';
import { NovelSceneTitleUpdatedEvent, NovelSceneTitleUpdatedEventData } from './novel-scene-title-updated.event';
import { NovelSceneTransferedEvent, NovelSceneTransferedEventData } from './novel-scene-transfered-event';
import { NovelTitleChangedEvent, NovelTitleChangedEventData } from './novel-title-changed-event';

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
        return new NovelTitleChangedEvent(
          data as NovelTitleChangedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelDescriptionChangedEvent.eventName:
        return new NovelDescriptionChangedEvent(
          data as NovelDescriptionChangedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterAddedEvent.eventName:
        return new NovelChapterAddedEvent(
          data as NovelChapterAddedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterDeletedEvent.eventName:
        return new NovelChapterDeletedEvent(
          data as NovelChapterDeletedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterMovedEvent.eventName:
        return new NovelChapterMovedEvent(
          data as NovelChapterMovedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterTitleUpdatedEvent.eventName:
        return new NovelChapterTitleUpdatedEvent(
          data as NovelChapterTitleUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelChapterOutlineUpdatedEvent.eventName:
        return new NovelChapterOutlineUpdatedEvent(
          data as NovelChapterOutlineUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneAddedEvent.eventName:
        return new NovelSceneAddedEvent(
          data as NovelSceneAddedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneDeletedEvent.eventName:
        return new NovelSceneDeletedEvent(
          data as NovelSceneDeletedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneMovedEvent.eventName:
        return new NovelSceneMovedEvent(
          data as NovelSceneMovedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneTransferedEvent.eventName:
        return new NovelSceneTransferedEvent(
          data as NovelSceneTransferedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneTitleUpdatedEvent.eventName:
        return new NovelSceneTitleUpdatedEvent(
          data as NovelSceneTitleUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneOutlineUpdatedEvent.eventName:
        return new NovelSceneOutlineUpdatedEvent(
          data as NovelSceneOutlineUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelScenePovUpdatedEvent.eventName:
        return new NovelScenePovUpdatedEvent(
          data as NovelScenePovUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneContentUpdatedEvent.eventName:
        return new NovelSceneContentUpdatedEvent(
          data as NovelSceneContentUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterAddedEvent.eventName:
        return new NovelCharacterAddedEvent(
          data as NovelCharacterAddedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterDeletedEvent.eventName:
        return new NovelCharacterDeletedEvent(
          data as NovelCharacterDeletedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterMovedEvent.eventName:
        return new NovelCharacterMovedEvent(
          data as NovelCharacterMovedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterNameUpdatedEvent.eventName:
        return new NovelCharacterNameUpdatedEvent(
          data as NovelCharacterNameUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterDescriptionUpdatedEvent.eventName:
        return new NovelCharacterDescriptionUpdatedEvent(
          data as NovelCharacterDescriptionUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterTagsUpdatedEvent.eventName:
        return new NovelCharacterTagsUpdatedEvent(
          data as NovelCharacterTagsUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterColorUpdatedEvent.eventName:
        return new NovelCharacterColorUpdatedEvent(
          data as NovelCharacterColorUpdatedEventData,
          userId,
          eventId,
          eventSequentialId
        );
      default:
        throw new Error(`Unknown domain event name: ${eventName}`);
    }
  }
}
