import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SseNotificationService, WsEvent } from '@owl/back/websocket';
import {
  AuthorDto,
  exquisiteCorpseEvents,
  ExquisiteCorpseTurnTakenEvent,
} from '@owl/shared/contracts';

import { ExCorpseTakeTurnEvent } from '../../domain/model';
import { exerciseConstants } from '../../domain/model/exercise-constants';
import {
  CancelTurnCommand,
  ConnectToExquisiteCorpseCommand,
  SubmitTurnCommand,
  TakeTurnCommand,
} from '../../domain/ports';
import { toExerciseDto } from '../api/mappers/exercise-dto.mappers';

class ExquisiteCorpseConnectionEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseTakeTurnEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseCancelTurnEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseSubmitTurnEvent extends WsEvent<{
  id: string;
  content: string;
}> {}

@Injectable()
export class ExquisiteCorpseEventHandlers {
  constructor(
    private readonly connectCommand: ConnectToExquisiteCorpseCommand,
    private readonly takeTurnCommand: TakeTurnCommand,
    private readonly submitTurnCommand: SubmitTurnCommand,
    private readonly cancelTurnCommand: CancelTurnCommand,
    private readonly notificationService: SseNotificationService
  ) {}

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

  @OnEvent(exquisiteCorpseEvents.connect)
  async handleExquisiteCorpseConnection(
    event: ExquisiteCorpseConnectionEvent
  ): Promise<void> {
    try {
      const exerciseId = event.payload.id;
      const exercise = await this.connectCommand.execute(
        event.userDetails.user.uid,
        exerciseId
      );

      // TODO fix design issue. Doing this to notification service
      // sends it every time to user.
      // I think this is where the front should handle it more properly, filtering the exercise
      await event.userDetails.joinRoom(exerciseConstants.getRoom(exerciseId));
      event.userDetails.sendToUser(
        exquisiteCorpseEvents.updates,
        exercise.content
      );
    } catch (e) {
      console.error(e);
    }
  }

  @OnEvent(exquisiteCorpseEvents.takeTurn)
  async handleExquisiteCorpseTakeTurn(
    event: ExquisiteCorpseTakeTurnEvent
  ): Promise<void> {
    try {
      await this.takeTurnCommand.execute(
        event.userDetails.user.uid,
        event.payload.id
      );
    } catch (e) {
      console.error(e);
    }
  }

  @OnEvent(exquisiteCorpseEvents.submitTurn)
  async handleExquisiteCorpseSubmitTurn(
    event: ExquisiteCorpseSubmitTurnEvent
  ): Promise<void> {
    try {
      await this.submitTurnCommand.execute(
        event.userDetails.user.uid,
        event.payload.id,
        event.payload.content
      );
    } catch (e) {
      console.error(e);
    }
  }

  @OnEvent(exquisiteCorpseEvents.cancelTurn)
  async handleExquisiteCorpseCancelTurn(
    event: ExquisiteCorpseCancelTurnEvent
  ): Promise<void> {
    try {
      await this.cancelTurnCommand.execute(
        event.userDetails.user.uid,
        event.payload.id
      );
    } catch (e) {
      console.error(e);
    }
  }
}
