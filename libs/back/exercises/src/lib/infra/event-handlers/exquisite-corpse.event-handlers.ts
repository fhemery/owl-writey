import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '@owl/back/user';
import { WsEvent } from '@owl/back/websocket';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import { exerciseConstants } from '../../domain/model/exercise-constants';
import { ExquisiteCorpseExercise } from '../../domain/model/exercises/exquisite-corpse';
import {
  ConnectToExquisiteCorpseCommand,
  ExerciseRepository,
} from '../../domain/ports';
import { TakeTurnCommand } from '../../domain/ports/in/exquisite-corpse/take-turn.command';

class ExquisiteCorpseConnectionEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseTakeTurnEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseSubmitTurnEvent extends WsEvent<{
  id: string;
  content: string;
}> {}

@Injectable()
export class ExquisiteCorpseEventHandlers {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    private readonly usersService: UsersService,
    private readonly connectCommand: ConnectToExquisiteCorpseCommand,
    private readonly takeTurnCommand: TakeTurnCommand
  ) {}

  @OnEvent(exquisiteCorpseEvents.connect)
  async handleExquisiteCorpseConnection(
    event: ExquisiteCorpseConnectionEvent
  ): Promise<void> {
    const exerciseId = event.payload.id;
    const exercise = await this.connectCommand.execute(
      event.userDetails.user.uid,
      exerciseId
    );

    // TODO fix design issue. Doing this to notification service
    // sends it every time to user.
    // I think this is where the front should handle it more properly, filtering the exercise
    event.userDetails.joinRoom(exerciseConstants.getRoom(exerciseId));
    event.userDetails.sendToUser(
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }

  @OnEvent(exquisiteCorpseEvents.takeTurn)
  async handleExquisiteCorpseTakeTurn(
    event: ExquisiteCorpseTakeTurnEvent
  ): Promise<void> {
    await this.takeTurnCommand.execute(
      event.userDetails.user.uid,
      event.payload.id
    );
  }

  @OnEvent(exquisiteCorpseEvents.submitTurn)
  async handleExquisiteCorpseSubmitTurn(
    event: ExquisiteCorpseSubmitTurnEvent
  ): Promise<void> {
    const exercise = (await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;

    exercise.submitTurn(event.userDetails.user.uid, event.payload.content);

    await this.exerciseRepository.saveContent(exercise);

    event.userDetails.sendToRoom(
      exerciseConstants.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }

  @OnEvent(exquisiteCorpseEvents.cancelTurn)
  async handleExquisiteCorpseCancelTurn(
    event: ExquisiteCorpseTakeTurnEvent
  ): Promise<void> {
    const exercise = (await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;

    exercise.cancelTurn(event.userDetails.user.uid);

    await this.exerciseRepository.saveContent(exercise);

    event.userDetails.sendToRoom(
      exerciseConstants.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
