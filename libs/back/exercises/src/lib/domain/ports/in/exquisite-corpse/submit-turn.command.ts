import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';

import {
  ExCorpseSubmitTurnEvent,
  ExquisiteCorpseExercise,
} from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class SubmitTurnCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    private eventEmitter: EventEmitterFacade
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

    this.eventEmitter.emit(new ExCorpseSubmitTurnEvent(exercise));
  }
}
