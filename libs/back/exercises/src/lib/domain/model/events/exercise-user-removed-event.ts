import { Exercise } from '../exercise';
import { ExerciseBaseDomainEvent } from './exercises-base-domain-event';

export class ExerciseUserRemovedEvent extends ExerciseBaseDomainEvent<{
  removedUserId: string;
}> {
  static EventName = 'exercise.user-removed';
  constructor(userId: string, exercise: Exercise, removedUserId: string) {
    super(ExerciseUserRemovedEvent.EventName, userId, {
      exercise,
      removedUserId,
    });
  }
}
