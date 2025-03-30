import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SseNotificationService } from '@owl/back/infra/sse';
import { NotificationEvent } from '@owl/shared/common/contracts';
import {
  ExercisedUpdateEvent,
  exquisiteCorpseTurnCanceledEvent,
  exquisiteCorpseTurnSubmittedEvent,
  exquisiteCorpseTurnTakenEvent,
} from '@owl/shared/exercises/contracts';

import {
  ExCorpseCancelTurnEvent,
  ExCorpseSubmitTurnEvent,
  ExCorpseTakeTurnEvent,
  ExquisiteCorpseExercise,
} from '../../domain/model';
import { exerciseConstants } from '../../domain/model/exercise-constants';
import { toExerciseDto } from '../api/mappers/exercise-dto.mappers';

@Injectable()
export class ExquisiteCorpseEventHandlers {
  constructor(private readonly notificationService: SseNotificationService) {}

  @OnEvent(ExCorpseTakeTurnEvent.eventName)
  async handleExquisiteCorpseTakeTurnEvent(
    event: ExCorpseTakeTurnEvent
  ): Promise<void> {
    const { exercise } = event.payload;
    const author = exercise?.content?.currentWriter?.author;
    if (!author) {
      return;
    }
    this.sendExerciseUpdateNotification(exercise);
    this.notificationService.notifyRoom(
      exerciseConstants.getRoom(exercise.id),
      new NotificationEvent(
        exquisiteCorpseTurnTakenEvent,
        {
          exercise: exercise.generalInfo.name,
          author: author.name,
        },
        author.uid
      )
    );
  }

  @OnEvent(ExCorpseSubmitTurnEvent.eventName)
  async handleExquisiteCorpseSubmitTurnEvent(
    event: ExCorpseSubmitTurnEvent
  ): Promise<void> {
    const { exercise, author } = event.payload;
    this.sendExerciseUpdateNotification(exercise);
    this.notificationService.notifyRoom(
      exerciseConstants.getRoom(exercise.id),
      new NotificationEvent(
        exquisiteCorpseTurnSubmittedEvent,
        {
          exercise: exercise.generalInfo.name,
          author: author.name,
        },
        author.uid
      )
    );
  }

  @OnEvent(ExCorpseCancelTurnEvent.eventName)
  async handleExquisiteCorpseCancelTurnEvent(
    event: ExCorpseCancelTurnEvent
  ): Promise<void> {
    const { exercise, lastAuthor } = event.payload;
    this.sendExerciseUpdateNotification(exercise);
    this.notificationService.notifyRoom(
      exerciseConstants.getRoom(exercise.id),
      new NotificationEvent(
        exquisiteCorpseTurnCanceledEvent,
        {
          exercise: exercise.generalInfo.name,
          author: lastAuthor.name,
        },
        lastAuthor.uid
      )
    );
  }

  private sendExerciseUpdateNotification(
    exercise: ExquisiteCorpseExercise
  ): void {
    this.notificationService.notifyRoomDistinctly(
      exerciseConstants.getRoom(exercise.id),
      (userId) =>
        new ExercisedUpdateEvent(
          toExerciseDto(exercise, process.env['BASE_APP_URL'] || '', userId)
        )
    );
  }
}
