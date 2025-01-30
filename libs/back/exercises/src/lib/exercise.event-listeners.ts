import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import { WsEvent } from './events/ws-events';
import { ExerciseRepository } from './exercise.repository';
import { Author, ExquisiteCorpseExercise } from './model/exercise';

class ExquisiteCorpseConnectionEvent extends WsEvent<{ id: string }> {}
class ExquisiteCorpseTakeTurnEvent extends WsEvent<{ id: string }> {}

@Injectable()
export class ExerciseEventListeners {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  @OnEvent(exquisiteCorpseEvents.connect)
  async handleExquisiteCorpseConnection(
    event: ExquisiteCorpseConnectionEvent
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    });

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

    exercise.setTurn(new Author(event.userDetails.user.uid, 'Alice')); // TODO: We need a userService, userController won't do the trick, we have no request to pass...

    // await this.exerciseRepository.save(exercise);

    event.userDetails.socket.emit(
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
