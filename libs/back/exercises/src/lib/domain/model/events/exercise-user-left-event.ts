import { Exercise } from '../exercise';
import { ExerciseBaseDomainEvent } from './exercises-base-domain-event';

export class ExerciseUserLeftEvent extends ExerciseBaseDomainEvent<object> {
  static EventName = 'exercise.user-left';
  constructor(userId: string, exercise: Exercise) {
    super(ExerciseUserLeftEvent.EventName, userId, { exercise });
  }
}
