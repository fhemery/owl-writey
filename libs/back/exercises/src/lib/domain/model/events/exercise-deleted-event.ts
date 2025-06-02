import { Exercise } from '../exercise';
import { ExerciseBaseDomainEvent } from './exercises-base-domain-event';

export class ExerciseDeletedEvent extends ExerciseBaseDomainEvent<object> {
  static EventName = 'exercise.deleted';
  constructor(userId: string, exercise: Exercise) {
    super(ExerciseDeletedEvent.EventName, userId, { exercise });
  }
}
