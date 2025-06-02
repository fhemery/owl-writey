import { Exercise } from '../exercise';
import { ExerciseBaseDomainEvent } from './exercises-base-domain-event';

export class ExerciseUserJoinedEvent extends ExerciseBaseDomainEvent<object> {
  static EventName = 'exercise.user-joined';
  constructor(userId: string, exercise: Exercise) {
    super(ExerciseUserJoinedEvent.EventName, userId, { exercise });
  }
}
