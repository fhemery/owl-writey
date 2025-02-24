import { Inject, Injectable } from '@nestjs/common';

import {
  ExerciseNotFoundException,
  ExquisiteCorpseExercise,
} from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class ConnectToExquisiteCorpseCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async execute(
    userId: string,
    exerciseId: string
  ): Promise<ExquisiteCorpseExercise> {
    const exercise = await this.exerciseRepository.get(exerciseId, {
      includeContent: true,
    });

    if (!exercise /*|| !exercise.participants.find((p) => p.uid === userId)*/) {
      throw new ExerciseNotFoundException(exerciseId);
    }

    return exercise as ExquisiteCorpseExercise;
  }
}
