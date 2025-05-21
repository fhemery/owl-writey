import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackingService } from '@owl/back/tracking';

import { NovelCreatedEvent, NovelDeletedEvent } from '../../domain/events';
import { NovelBaseTrackingEvent } from './events/novel-base-tracking-event';
import { NovelCreatedTrackingEvent } from './events/novel-created-tracking-event';
import { NovelDeletedTrackingEvent } from './events/novel-deleted-tracking-event';

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
    await this.sendEvent(new NovelDeletedTrackingEvent(novel.id));
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
