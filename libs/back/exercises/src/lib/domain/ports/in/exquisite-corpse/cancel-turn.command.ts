import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';

import {
  ExCorpseCancelTurnEvent,
  ExerciseException,
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

    const lastAuthor = exercise.content?.currentWriter?.author;
    if (!lastAuthor) {
      throw new ExerciseException('Turn is not attributed');
    }

    exercise.cancelTurn(userId);

    await this.exerciseRepository.saveContent(exercise);

    this.eventEmitter.emit(
      new ExCorpseCancelTurnEvent(exercise, lastAuthor, userId)
    );
  }
}
