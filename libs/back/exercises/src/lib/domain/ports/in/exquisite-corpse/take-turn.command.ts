import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterFacade } from '@owl/back/infra/events';

import {
  ExCorpseTakeTurnEvent,
  ExerciseUser,
  ExquisiteCorpseExercise,
} from '../../../model';
import { ExerciseRepository, ExerciseUserFacade } from '../../out';

@Injectable()
export class TakeTurnCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(ExerciseUserFacade)
    private readonly usersService: ExerciseUserFacade,
    private readonly eventEmitter: EventEmitterFacade
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    // TODO : Use the GetExerciceQuery?
    const exercise = (await this.exerciseRepository.get(exerciseId, {
      includeContent: true,
    })) as ExquisiteCorpseExercise;
    const user = await this.usersService.get(userId);
    if (!user) {
      return;
    }

    const author = new ExerciseUser(user.uid, user.name);
    exercise.setTurn(author);

    await this.exerciseRepository.saveContent(exercise);

    this.eventEmitter.emit(new ExCorpseTakeTurnEvent(exercise));
  }
}
