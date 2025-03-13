import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/websocket';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import {
  ExCorpseTakeTurnEvent,
  ExerciseUser,
  ExquisiteCorpseExercise,
} from '../../../model';
import { exerciseConstants } from '../../../model/exercise-constants';
import {
  ExerciseRepository,
  ExerciseUserFacade,
  NotificationFacade,
} from '../../out';

@Injectable()
export class TakeTurnCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(ExerciseUserFacade)
    private readonly usersService: ExerciseUserFacade,
    @Inject(NotificationFacade)
    private readonly notificationService: NotificationFacade,
    private readonly eventEmitter: EventEmitterFacade
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    // TODO : Use the GetExerciceQuery?
    const exercise = (await this.exerciseRepository.get(exerciseId, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;
    const user = await this.usersService.get(userId);
    if (!user) {
      return;
    }

    const author = new ExerciseUser(user.uid, user.name);
    exercise.setTurn(author);

    await this.exerciseRepository.saveContent(exercise);

    this.eventEmitter.emit(new ExCorpseTakeTurnEvent(exercise));

    await this.notificationService.notifyRoom(
      exerciseConstants.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
