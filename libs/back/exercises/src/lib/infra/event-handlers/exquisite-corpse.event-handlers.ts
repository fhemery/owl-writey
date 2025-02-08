import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '@owl/back/user';
import { WsEvent } from '@owl/back/websocket';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import { Author, ExquisiteCorpseExercise } from '../../domain/model/exercise';
import { ExerciseRepository } from '../../domain/ports';

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
    private readonly usersService: UsersService
  ) {}
  private getRoom(exerciseId: string): string {
    return `ex-${exerciseId}`;
  }

  @OnEvent(exquisiteCorpseEvents.connect)
  async handleExquisiteCorpseConnection(
    event: ExquisiteCorpseConnectionEvent
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    });
    if (!exercise) {
      console.error(
        'Trying to connect to an exercise that does not exist',
        event.payload.id
      );
      return;
    }

    event.userDetails.joinRoom(this.getRoom(exercise.id));

    event.userDetails.sendToUser(
      exquisiteCorpseEvents.updates,
      exercise?.content
    );
  }

  @OnEvent(exquisiteCorpseEvents.takeTurn)
  async handleExquisiteCorpseTakeTurn(
    event: ExquisiteCorpseTakeTurnEvent
  ): Promise<void> {
    const exercise = (await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;
    const user = await this.usersService.get(event.userDetails.user.uid);
    if (!user) {
      return;
    }

    exercise.setTurn(new Author(user.uid, user.name));

    await this.exerciseRepository.saveContent(exercise);

    event.userDetails.sendToRoom(
      this.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
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
      this.getRoom(exercise.id),
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
      this.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
