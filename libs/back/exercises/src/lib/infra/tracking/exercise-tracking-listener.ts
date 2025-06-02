import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackingService } from '@owl/back/tracking';

import { ExerciseCreatedEvent } from '../../domain/model';
import { ExerciseBaseTrackingEvent } from './events/exercise-base-tracking-event';
import { ExerciseCreatedTrackingEvent } from './events/exercise-created-tracking-event';

@Injectable()
export class ExerciseTrackingListener {
  private readonly logger = new Logger(ExerciseTrackingListener.name);

  constructor(private readonly trackingService: TrackingService) {}

  @OnEvent(ExerciseCreatedEvent.EventName)
  async handleExerciseCreatedEvent(event: ExerciseCreatedEvent): Promise<void> {
    const { exercise, userId } = event.payload;
    await this.sendEvent(
      new ExerciseCreatedTrackingEvent(
        exercise.id,
        { type: exercise.type },
        userId
      )
    );
  }

  private async sendEvent(
    event: ExerciseBaseTrackingEvent<object>
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
