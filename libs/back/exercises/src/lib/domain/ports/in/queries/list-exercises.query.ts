import { Inject, Injectable } from '@nestjs/common';

import { ExerciseSummary } from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class ListExercisesQuery {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async execute(userId: string): Promise<ExerciseSummary[]> {
    return await this.exerciseRepository.getAll(userId);
  }
}
