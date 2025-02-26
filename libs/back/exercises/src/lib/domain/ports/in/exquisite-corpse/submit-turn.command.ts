import { Inject, Injectable } from '@nestjs/common';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import { ExquisiteCorpseExercise } from '../../../model';
import { exerciseConstants } from '../../../model/exercise-constants';
import { ExerciseRepository, NotificationFacade } from '../../out';

@Injectable()
export class SubmitTurnCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(NotificationFacade)
    private readonly notificationService: NotificationFacade
  ) {}

  async execute(
    userId: string,
    exerciseId: string,
    content: string
  ): Promise<void> {
    const exercise = (await this.exerciseRepository.get(exerciseId, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;

    exercise.submitTurn(userId, content);

    if (
      exercise.config.nbIterations &&
      (exercise.content?.scenes?.length || 0) > exercise.config.nbIterations
    ) {
      exercise.finish();
      await this.exerciseRepository.save(exercise);
    }

    await this.exerciseRepository.saveContent(exercise);

    await this.notificationService.notifyRoom(
      exerciseConstants.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
