import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackingService } from '@owl/back/tracking';
import { countWordsFromHtml } from '@owl/shared/word-utils';

import {
  ExCorpseCancelTurnEvent,
  ExCorpseSubmitTurnEvent,
  ExCorpseTakeTurnEvent,
} from '../../domain/model';
import {
  ExerciseBaseTrackingEvent,
  ExquisiteCorpseContentSubmittedTrackingEvent,
  ExquisiteCorpseTurnCanceledTrackingEvent,
  ExquisiteCorpseTurnTakenTrackingEvent,
} from './events';

@Injectable()
export class ExquisiteCorpseTrackingListener {
  private readonly logger = new Logger(ExquisiteCorpseTrackingListener.name);

  constructor(private readonly trackingService: TrackingService) {}

  @OnEvent(ExCorpseTakeTurnEvent.EventName)
  async handleExerciseTakeTurnEvent(
    event: ExCorpseTakeTurnEvent
  ): Promise<void> {
    const { exercise } = event.payload;
    const userId = exercise.content?.currentWriter?.author.uid;
    if (!userId) {
      return;
    }
    await this.sendEvent(
      new ExquisiteCorpseTurnTakenTrackingEvent(exercise.id, userId)
    );
  }

  @OnEvent(ExCorpseSubmitTurnEvent.EventName)
  async handleExerciseSubmitTurnEvent(
    event: ExCorpseSubmitTurnEvent
  ): Promise<void> {
    const { exercise, author } = event.payload;
    const lastScene =
      exercise.content?.scenes?.[exercise.content.scenes.length - 1];
    await this.sendEvent(
      new ExquisiteCorpseContentSubmittedTrackingEvent(
        exercise.id,
        author.uid,
        countWordsFromHtml(lastScene?.text || '')
      )
    );
  }

  @OnEvent(ExCorpseCancelTurnEvent.EventName)
  async handleExerciseCancelTurnEvent(
    event: ExCorpseCancelTurnEvent
  ): Promise<void> {
    const { exercise, lastAuthor, cancelingUserId } = event.payload;
    await this.sendEvent(
      new ExquisiteCorpseTurnCanceledTrackingEvent(
        exercise.id,
        lastAuthor.uid,
        cancelingUserId
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
