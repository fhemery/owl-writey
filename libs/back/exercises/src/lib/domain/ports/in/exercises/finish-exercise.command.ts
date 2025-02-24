import { Inject, Injectable } from '@nestjs/common';

import { ExerciseNotFoundException } from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class FinishExerciseCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new ExerciseNotFoundException(exerciseId);
    }

    exercise.finish(userId);
    await this.exerciseRepository.save(exercise);
  }
}
