import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackingEvent, TrackingService } from '@owl/back/tracking';

import { UserCreatedEvent, UserDeletedEvent } from '../model';
import { UserCreatedTrackingEvent, UserDeletedTrackingEvent } from './events';

@Injectable()
export class UserTrackingEventListeners {
  private readonly logger = new Logger(UserTrackingEventListeners.name);

  constructor(private readonly trackingService: TrackingService) {}

  @OnEvent(UserCreatedEvent.eventName)
  async handleUserCreatedEvent(event: UserCreatedEvent): Promise<void> {
    await this.sendEvent(new UserCreatedTrackingEvent(event.payload.uid));
  }

  @OnEvent(UserDeletedEvent.eventName)
  async handleUserDeletedEvent(event: UserDeletedEvent): Promise<void> {
    await this.sendEvent(new UserDeletedTrackingEvent(event.payload.uid));
  }

  private async sendEvent(event: TrackingEvent): Promise<void> {
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
