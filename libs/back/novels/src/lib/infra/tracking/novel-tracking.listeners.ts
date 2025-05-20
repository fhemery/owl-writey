import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackingService } from '@owl/back/tracking';

import { NovelCreateEvent } from '../../domain/events';
import { NovelCreatedTrackingEvent } from './events/novel-created-tracking-event';

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
  @OnEvent(NovelCreateEvent.EventName)
  async handleNovelCreatedEvent(event: NovelCreateEvent): Promise<void> {
    try {
      const novel = event.payload;
      await this.trackingService.trackEvent(
        new NovelCreatedTrackingEvent(
          novel.id,
          novel.generalInfo.title,
          novel.participants[0].uid
        )
      );
    } catch (error) {
      this.logger.error(
        `Failed to track novel creation event: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
