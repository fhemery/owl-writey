import { Inject, Injectable } from '@nestjs/common';
import { SseNotificationService } from '@owl/back/websocket';
import { ConnectToExerciseEvent } from '@owl/shared/contracts';

import {
  ExerciseNotFoundException,
  ExquisiteCorpseExercise,
} from '../../../model';
import { ExerciseRepository, ExerciseUserFacade } from '../../out';

@Injectable()
export class ConnectToExquisiteCorpseCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(ExerciseUserFacade)
    private readonly userFacade: ExerciseUserFacade,
    // TODO change the contract for a facade
    readonly sseService: SseNotificationService
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

    const user = await this.userFacade.get(userId);
    if (user) {
      for (const part of exercise.getParticipants()) {
        if (part.uid === userId) {
          continue;
        }
        this.sseService.notifyUser(
          part.uid,
          new ConnectToExerciseEvent(user?.name, exercise.generalInfo.name)
        );
      }
    }

    return exercise as ExquisiteCorpseExercise;
  }
}
