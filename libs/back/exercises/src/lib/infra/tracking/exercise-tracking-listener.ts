import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackingService } from '@owl/back/tracking';

import {
  ExerciseCreatedEvent,
  ExerciseUserJoinedEvent,
  ExerciseUserLeftEvent,
  ExerciseUserRemovedEvent,
} from '../../domain/model';
import {
  ExerciseBaseTrackingEvent,
  ExerciseCreatedTrackingEvent,
  ExerciseUserJoinedTrackingEvent,
  ExerciseUserLeftTrackingEvent,
  ExerciseUserRemovedTrackingEvent,
} from './events';

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

  @OnEvent(ExerciseUserJoinedEvent.EventName)
  async handleExerciseUserJoinedEvent(
    event: ExerciseUserJoinedEvent
  ): Promise<void> {
    const { exercise, userId } = event.payload;
    await this.sendEvent(
      new ExerciseUserJoinedTrackingEvent(exercise.id, userId)
    );
  }

  @OnEvent(ExerciseUserLeftEvent.EventName)
  async handleExerciseUserLeftEvent(
    event: ExerciseUserLeftEvent
  ): Promise<void> {
    const { exercise, userId } = event.payload;
    await this.sendEvent(
      new ExerciseUserLeftTrackingEvent(exercise.id, userId)
    );
  }

  @OnEvent(ExerciseUserRemovedEvent.EventName)
  async handleExerciseUserRemovedEvent(
    event: ExerciseUserRemovedEvent
  ): Promise<void> {
    const { exercise, userId } = event.payload;
    await this.sendEvent(
      new ExerciseUserRemovedTrackingEvent(
        exercise.id,
        userId,
        event.payload.removedUserId
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
