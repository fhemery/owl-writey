import { Exercise } from '../exercise';
import { ExerciseBaseDomainEvent } from './exercises-base-domain-event';

export class ExerciseCreatedEvent extends ExerciseBaseDomainEvent<object> {
  static EventName = 'exercise.created';
  constructor(userId: string, exercise: Exercise) {
    super(ExerciseCreatedEvent.EventName, userId, { exercise });
  }
}
