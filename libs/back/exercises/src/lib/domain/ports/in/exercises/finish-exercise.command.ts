import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';

import {
  ExerciseFinishedEvent,
  ExerciseNotFoundException,
} from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class FinishExerciseCommand {
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

    exercise.finish(userId);
    await this.exerciseRepository.save(exercise);
    await this.eventEmitterFacade.emit(
      new ExerciseFinishedEvent(userId, exercise)
    );
  }
}
