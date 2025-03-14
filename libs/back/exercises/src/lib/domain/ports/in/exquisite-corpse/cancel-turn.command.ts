import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/websocket';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import {
  ExCorpseCancelTurnEvent,
  ExquisiteCorpseExercise,
} from '../../../model';
import { exerciseConstants } from '../../../model/exercise-constants';
import { ExerciseRepository, NotificationFacade } from '../../out';

@Injectable()
export class CancelTurnCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(NotificationFacade)
    private readonly notificationFacade: NotificationFacade,
    private readonly eventEmitter: EventEmitterFacade
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    const exercise = (await this.exerciseRepository.get(exerciseId, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;

    exercise.cancelTurn(userId);

    await this.exerciseRepository.saveContent(exercise);

    this.eventEmitter.emit(new ExCorpseCancelTurnEvent(exercise));

    await this.notificationFacade.notifyRoom(
      exerciseConstants.getRoom(exercise.id),
      exquisiteCorpseEvents.updates,
      exercise.content
    );
  }
}
