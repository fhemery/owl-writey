import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';

import {
  ExCorpseCancelTurnEvent,
  ExquisiteCorpseExercise,
} from '../../../model';
import { ExerciseRepository } from '../../out';

@Injectable()
export class CancelTurnCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    private readonly eventEmitter: EventEmitterFacade
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    const exercise = (await this.exerciseRepository.get(exerciseId, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;

    exercise.cancelTurn(userId);

    await this.exerciseRepository.saveContent(exercise);

    this.eventEmitter.emit(new ExCorpseCancelTurnEvent(exercise));
  }
}
