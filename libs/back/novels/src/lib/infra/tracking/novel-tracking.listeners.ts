import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackingService } from '@owl/back/tracking';
import {
  Novel,
  NovelBaseDomainEvent,
  NovelChapterAddedEvent,
  NovelChapterDeletedEvent,
  NovelCharacterAddedEvent,
  NovelCharacterColorUpdatedEvent,
  NovelCharacterDeletedEvent,
  NovelCharacterTagsUpdatedEvent,
  NovelSceneAddedEvent,
  NovelSceneDeletedEvent,
} from '@owl/shared/novels/model';

import {
  NovelCreatedEvent,
  NovelDeletedEvent,
  NovelUpdatedEvent,
} from '../../domain/events';
import { NovelBaseTrackingEvent } from './events/novel-base-tracking-event';
import { NovelChapterAddedTrackingEvent } from './events/novel-chapter-added-tracking-event';
import { NovelChapterDeletedTrackingEvent } from './events/novel-chapter-deleted-tracking-event';
import { NovelCharacterAddedTrackingEvent } from './events/novel-character-added-tracking-event';
import { NovelCharacterColorChangedTrackingEvent } from './events/novel-character-color-changed-tracking-event';
import { NovelCharacterDeletedTrackingEvent } from './events/novel-character-deleted-tracking-event';
import { NovelCharacterTagsChangedTrackingEvent } from './events/novel-character-tags-changed-tracking-event';
import { NovelCreatedTrackingEvent } from './events/novel-created-tracking-event';
import { NovelDeletedTrackingEvent } from './events/novel-deleted-tracking-event';
import { NovelSceneAddedTrackingEvent } from './events/novel-scene-added-tracking-event';
import { NovelSceneDeletedTrackingEvent } from './events/novel-scene-deleted-tracking-event';

/**
 * Listener for novel-related events to track them in analytics
 */
@Injectable()
export class NovelTrackingListeners {
  private readonly logger = new Logger(NovelTrackingListeners.name);

  constructor(private readonly trackingService: TrackingService) {}

  /**
   * Handle novel created events
   * @param event The novel created event
   */
  @OnEvent(NovelCreatedEvent.EventName)
  async handleNovelCreatedEvent(event: NovelCreatedEvent): Promise<void> {
    const novel = event.payload;
    await this.sendEvent(
      new NovelCreatedTrackingEvent(
        novel.id,
        novel.generalInfo.title,
        novel.participants[0].uid,
        novel.participants[0].uid
      )
    );
  }

  /**
   * Handle novel deleted events
   * @param event The novel deleted event
   */
  @OnEvent(NovelDeletedEvent.EventName)
  async handleNovelDeletedEvent(event: NovelDeletedEvent): Promise<void> {
    const novel = event.payload;
    await this.sendEvent(
      new NovelDeletedTrackingEvent(novel.id, novel.participants[0].uid)
    );
  }

  @OnEvent(NovelUpdatedEvent.EventName)
  async handleNovelUpdatedEvent(event: NovelUpdatedEvent): Promise<void> {
    const trackingEvent = this.convertToTrackingEvent(
      event.payload.event,
      event.payload.novel
    );
    if (!trackingEvent) {
      return;
    }
    await this.sendEvent(trackingEvent);
  }
  convertToTrackingEvent(
    event: NovelBaseDomainEvent,
    novel: Novel
  ): NovelBaseTrackingEvent | null {
    switch (event.eventName) {
      case NovelChapterAddedEvent.eventName:
        return new NovelChapterAddedTrackingEvent(
          novel.id,
          (event as NovelChapterAddedEvent).data.id,
          novel.participants[0].uid
        );
      case NovelChapterDeletedEvent.eventName:
        return new NovelChapterDeletedTrackingEvent(
          novel.id,
          (event as NovelChapterDeletedEvent).data.id,
          novel.participants[0].uid
        );
      case NovelCharacterAddedEvent.eventName:
        return new NovelCharacterAddedTrackingEvent(
          novel.id,
          (event as NovelCharacterAddedEvent).data.characterId,
          novel.participants[0].uid
        );
      case NovelCharacterDeletedEvent.eventName:
        return new NovelCharacterDeletedTrackingEvent(
          novel.id,
          (event as NovelCharacterDeletedEvent).data.characterId,
          novel.participants[0].uid
        );
      case NovelCharacterColorUpdatedEvent.eventName:
        return new NovelCharacterColorChangedTrackingEvent(
          novel.id,
          (event as NovelCharacterColorUpdatedEvent).data.characterId,
          (event as NovelCharacterColorUpdatedEvent).data.color || 'undefined',
          novel.participants[0].uid
        );
      case NovelCharacterTagsUpdatedEvent.eventName:
        return new NovelCharacterTagsChangedTrackingEvent(
          novel.id,
          (event as NovelCharacterTagsUpdatedEvent).data.characterId,
          (event as NovelCharacterTagsUpdatedEvent).data.tags,
          novel.participants[0].uid
        );
      case NovelSceneAddedEvent.eventName:
        return new NovelSceneAddedTrackingEvent(
          novel.id,
          (event as NovelSceneAddedEvent).data.chapterId,
          (event as NovelSceneAddedEvent).data.sceneId,
          novel.participants[0].uid
        );
      case NovelSceneDeletedEvent.eventName:
        return new NovelSceneDeletedTrackingEvent(
          novel.id,
          (event as NovelSceneDeletedEvent).data.chapterId,
          (event as NovelSceneDeletedEvent).data.sceneId,
          novel.participants[0].uid
        );
      default:
        return null;
    }
  }

  /**
   * Private helper method to encapsulate try-catch logic for tracking events
   * @param trackingFn The tracking function to execute
   * @param eventType The type of event being tracked (for error logging)
   */
  private async sendEvent(
    event: NovelBaseTrackingEvent<object>
  ): Promise<void> {
    try {
      await this.trackingService.trackEvent(event);
    } catch (error) {
      this.logger.error(
        `Failed to track ${event.eventName} event: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
