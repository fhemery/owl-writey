import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';

import { ExerciseDeletedEvent, ExerciseUserLeftEvent } from '../../../model';
import { ExerciseRepository } from '../../out';

// TODO: Write a test for this
@Injectable()
export class DeleteAllExercisesFromUserCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(EventEmitterFacade)
    private readonly eventEmitterFacade: EventEmitterFacade
  ) {}

  async execute(uid: string): Promise<void> {
    const exercises = await this.exerciseRepository.getAll(uid, {
      includeFinished: true,
    });
    for (const ex of exercises) {
      const exercise = await this.exerciseRepository.get(ex.id);
      if (!exercise) {
        continue;
      }
      if (exercise.isParticipantAdmin(uid)) {
        await this.exerciseRepository.delete(ex.id);
        await this.eventEmitterFacade.emit(
          new ExerciseDeletedEvent(uid, exercise)
        );
      } else {
        exercise.removeParticipant(uid, uid);
        await this.exerciseRepository.save(exercise);
        await this.eventEmitterFacade.emit(
          new ExerciseUserLeftEvent(uid, exercise)
        );
      }
    }
  }
}
