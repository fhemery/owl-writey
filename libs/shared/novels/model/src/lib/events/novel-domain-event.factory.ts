import { NovelBaseDomainEvent } from './novel-base-domain-event';
import { NovelChapterAddedEvent } from './novel-chapter-added-event';
import { NovelChapterDeletedEvent } from './novel-chapter-deleted-event';
import { NovelChapterMovedEvent } from './novel-chapter-moved-event';
import { NovelChapterOutlineUpdatedEvent } from './novel-chapter-outline-updated.event';
import { NovelChapterTitleUpdatedEvent } from './novel-chapter-title-updated.event';
import { NovelCharacterAddedEvent } from './novel-character-added-event';
import { NovelCharacterDeletedEvent } from './novel-character-deleted-event';
import { NovelCharacterDescriptionUpdatedEvent } from './novel-character-description-updated.event';
import { NovelCharacterMovedEvent } from './novel-character-moved-event';
import { NovelCharacterNameUpdatedEvent } from './novel-character-name-updated.event';
import { NovelCharacterTagsUpdatedEvent } from './novel-character-tags-updated.event';
import { NovelDescriptionChangedEvent } from './novel-description-changed-event';
import { NovelSceneAddedEvent } from './novel-scene-added-event';
import { NovelSceneContentUpdatedEvent } from './novel-scene-content-updated.event';
import { NovelSceneDeletedEvent } from './novel-scene-deleted-event';
import { NovelSceneMovedEvent } from './novel-scene-moved-event';
import { NovelSceneOutlineUpdatedEvent } from './novel-scene-outline-updated.event';
import { NovelScenePovUpdatedEvent } from './novel-scene-pov-updated.event';
import { NovelSceneTitleUpdatedEvent } from './novel-scene-title-updated.event';
import { NovelSceneTransferedEvent } from './novel-scene-transfered-event';
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
      case NovelSceneTransferedEvent.eventName:
        return NovelSceneTransferedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneTitleUpdatedEvent.eventName:
        return NovelSceneTitleUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneOutlineUpdatedEvent.eventName:
        return NovelSceneOutlineUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelScenePovUpdatedEvent.eventName:
        return NovelScenePovUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelSceneContentUpdatedEvent.eventName:
        return NovelSceneContentUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterAddedEvent.eventName:
        return NovelCharacterAddedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterDeletedEvent.eventName:
        return NovelCharacterDeletedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterMovedEvent.eventName:
        return NovelCharacterMovedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterNameUpdatedEvent.eventName:
        return NovelCharacterNameUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterDescriptionUpdatedEvent.eventName:
        return NovelCharacterDescriptionUpdatedEvent.From(
          data,
          userId,
          eventId,
          eventSequentialId
        );
      case NovelCharacterTagsUpdatedEvent.eventName:
        return NovelCharacterTagsUpdatedEvent.From(
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
