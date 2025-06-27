import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';

import { ExerciseDeletedEvent } from '../../../model';
import { ExerciseNotFoundException } from '../../../model/exceptions/exercice-not-found.exception';
import { ExerciseRepository } from '../../out';

@Injectable()
export class DeleteExerciseCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(EventEmitterFacade)
    private readonly eventEmitterFacade: EventEmitterFacade
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new ExerciseNotFoundException(exerciseId);
    }

    exercise.checkDelete(userId);

    await this.exerciseRepository.delete(exerciseId);
    await this.eventEmitterFacade.emit(
      new ExerciseDeletedEvent(userId, exercise)
    );
  }
}
