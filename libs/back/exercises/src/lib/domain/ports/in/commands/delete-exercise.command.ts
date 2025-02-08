import { Inject, Injectable } from '@nestjs/common';

import { ExerciseNotFoundException } from '../../../model/exceptions/exercice-not-found.exception';
import { ExerciseRepository } from '../../out';

@Injectable()
export class DeleteExerciseCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new ExerciseNotFoundException(exerciseId);
    }

    exercise.checkDelete(userId);

    await this.exerciseRepository.delete(exerciseId);
  }
}
