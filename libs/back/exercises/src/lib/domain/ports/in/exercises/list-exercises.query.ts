import { Inject, Injectable } from '@nestjs/common';

import { ExerciseSummary, QueryFilter } from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class ListExercisesQuery {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async execute(
    userId: string,
    queryFilter: QueryFilter
  ): Promise<ExerciseSummary[]> {
    return await this.exerciseRepository.getAll(userId, queryFilter);
  }
}
