import { Inject } from '@nestjs/common';
import { ExerciseParticipantRole } from '@owl/shared/contracts';
import { v4 as uuidV4 } from 'uuid';

import {
  ExerciseFactory,
  ExerciseParticipant,
  ExerciseToCreate,
} from '../../../model';
import { ExerciseRepository, ExerciseUserFacade } from '../../out';

export class CreateExerciseCommand {
  constructor(
    @Inject(ExerciseUserFacade) private readonly userFacade: ExerciseUserFacade,
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
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
      exerciseToCreate.name,
      exerciseToCreate.type,
      exerciseToCreate.config,
      [
        new ExerciseParticipant(
          user.uid,
          user.name,
          ExerciseParticipantRole.Admin
        ),
      ]
    );
    await this.exerciseRepository.save(exercise);
    return id;
  }
}
