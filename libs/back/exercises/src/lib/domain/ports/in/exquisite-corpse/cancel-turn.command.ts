import { Inject, Injectable } from '@nestjs/common';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import { ExquisiteCorpseExercise } from '../../../model';
import { exerciseConstants } from '../../../model/exercise-constants';
import { ExerciseRepository, NotificationFacade } from '../../out';

@Injectable()
export class CancelTurnCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(NotificationFacade)
    private readonly notificationFacade: NotificationFacade
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    const exercise = (await this.exerciseRepository.get(exerciseId, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;

    exercise.cancelTurn(userId);

    await this.exerciseRepository.saveContent(exercise);

    this.notificationFacade.notifyRoom(
      exerciseConstants.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
