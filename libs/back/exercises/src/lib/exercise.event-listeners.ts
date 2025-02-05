import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '@owl/back/user';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import { WsEvent } from './events/ws-events';
import { ExerciseRepository } from './exercise.repository';
import { Author, ExquisiteCorpseExercise } from './model/exercise';

class ExquisiteCorpseConnectionEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseTakeTurnEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseSubmitTurnEvent extends WsEvent<{
  id: string;
  content: string;
}> {}

@Injectable()
export class ExerciseEventListeners {
  constructor(
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
      return; // TODO : what do we do if room does not exist?
    }

    event.userDetails.socket.join(this.getRoom(exercise.id));
    // TODO add user to its own room as well just in case

    event.userDetails.socket.emit(
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

    event.userDetails.server
      .to(this.getRoom(exercise.id))
      .emit(exquisiteCorpseEvents.updates, exercise.content);
  }

  // TODO test this method
  @OnEvent(exquisiteCorpseEvents.submitTurn)
  async handleExquisiteCorpseSubmitTurn(
    event: ExquisiteCorpseSubmitTurnEvent
  ): Promise<void> {
    const exercise = (await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;

    exercise.submitTurn(event.userDetails.user.uid, event.payload.content);

    await this.exerciseRepository.saveContent(exercise);

    event.userDetails.server.emit(
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
