import { Inject } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';
import {
  ExerciseParticipantRole,
  ExerciseStatus,
} from '@owl/shared/exercises/contracts';
import { v4 as uuidV4 } from 'uuid';

import {
  ExerciseCreatedEvent,
  ExerciseFactory,
  ExerciseGeneralInfo,
  ExerciseParticipant,
  ExerciseToCreate,
} from '../../../model';
import { ExerciseRepository, ExerciseUserFacade } from '../../out';

export class CreateExerciseCommand {
  constructor(
    @Inject(ExerciseUserFacade) private readonly userFacade: ExerciseUserFacade,
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(EventEmitterFacade)
    private readonly eventEmitterFacade: EventEmitterFacade
  ) {}

  async execute(
    userId: string,
    exerciseToCreate: ExerciseToCreate
  ): Promise<string> {
    const id = uuidV4();

    const user = await this.userFacade.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const exercise = ExerciseFactory.From(
      id,
      new ExerciseGeneralInfo(exerciseToCreate.name, ExerciseStatus.Ongoing, [
        new ExerciseParticipant(
          user.uid,
          user.name,
          ExerciseParticipantRole.Admin
        ),
      ]),
      exerciseToCreate.type,
      exerciseToCreate.config
    );
    await this.exerciseRepository.save(exercise);
    this.eventEmitterFacade.emit(new ExerciseCreatedEvent(userId, exercise));
    return id;
  }
}
