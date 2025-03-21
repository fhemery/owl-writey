import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserDeletedEvent } from '@owl/back/user';

import { DeleteAllExercisesFromUserCommand } from '../../domain/ports';

@Injectable()
export class ExerciseEventHandlers {
  constructor(
    private readonly deleteAllExercisesFromUserCommand: DeleteAllExercisesFromUserCommand
  ) {}
  @OnEvent(UserDeletedEvent.eventName)
  async handleUserDeletedEvent(event: UserDeletedEvent): Promise<void> {
    const { uid } = event.payload;
    await this.deleteAllExercisesFromUserCommand.execute(uid);
  }
}
