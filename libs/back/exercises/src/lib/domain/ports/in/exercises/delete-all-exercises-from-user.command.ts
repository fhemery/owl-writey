import { Inject, Injectable } from '@nestjs/common';

import { ExerciseRepository } from '../../out';

// TODO: Write a test for this
@Injectable()
export class DeleteAllExercisesFromUserCommand {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
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
      } else {
        exercise.removeParticipant(uid, uid);
        await this.exerciseRepository.save(exercise);
      }
    }
  }
}
