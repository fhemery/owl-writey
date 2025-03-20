import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SseNotificationService } from '@owl/back/infra/sse';
import {
  AuthorDto,
  ExquisiteCorpseTurnCanceledEvent,
  ExquisiteCorpseTurnSubmittedEvent,
  ExquisiteCorpseTurnTakenEvent,
} from '@owl/shared/contracts';

import {
  ExCorpseCancelTurnEvent,
  ExCorpseSubmitTurnEvent,
  ExCorpseTakeTurnEvent,
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
    const streams = this.notificationService.getStreams(
      exerciseConstants.getRoom(exercise.id)
    );
    for (const stream of streams) {
      stream.stream.next({
        data: new ExquisiteCorpseTurnTakenEvent(
          toExerciseDto(
            exercise,
            process.env['BASE_APP_URL'] || '',
            stream.userId
          ),
          exercise?.content?.currentWriter?.author || ({} as AuthorDto)
        ),
      });
    }
  }

  @OnEvent(ExCorpseSubmitTurnEvent.eventName)
  async handleExquisiteCorpseSubmitTurnEvent(
    event: ExCorpseSubmitTurnEvent
  ): Promise<void> {
    const { exercise, author } = event.payload;
    const streams = this.notificationService.getStreams(
      exerciseConstants.getRoom(exercise.id)
    );
    for (const stream of streams) {
      stream.stream.next({
        data: new ExquisiteCorpseTurnSubmittedEvent(
          toExerciseDto(
            exercise,
            process.env['BASE_APP_URL'] || '',
            stream.userId
          ),
          author
        ),
      });
    }
  }

  @OnEvent(ExCorpseCancelTurnEvent.eventName)
  async handleExquisiteCorpseCancelTurnEvent(
    event: ExCorpseCancelTurnEvent
  ): Promise<void> {
    const { exercise, lastAuthor } = event.payload;
    const streams = this.notificationService.getStreams(
      exerciseConstants.getRoom(exercise.id)
    );
    for (const stream of streams) {
      stream.stream.next({
        data: new ExquisiteCorpseTurnCanceledEvent(
          toExerciseDto(
            exercise,
            process.env['BASE_APP_URL'] || '',
            stream.userId
          ),
          lastAuthor
        ),
      });
    }
  }
}
