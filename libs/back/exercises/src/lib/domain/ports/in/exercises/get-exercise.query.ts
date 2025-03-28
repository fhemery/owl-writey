import { Inject, Injectable } from '@nestjs/common';

import { Exercise } from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class GetExerciseQuery {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}
  async execute(userId: string, exerciseId: string): Promise<Exercise | null> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (exercise && exercise.getParticipants().some((p) => p.uid === userId)) {
      return exercise;
    }
    return null;
  }
}
