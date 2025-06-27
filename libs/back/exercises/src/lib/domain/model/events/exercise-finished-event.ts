import { Exercise } from '../exercise';
import { ExerciseBaseDomainEvent } from './exercises-base-domain-event';

export class ExerciseFinishedEvent extends ExerciseBaseDomainEvent<object> {
  static EventName = 'exercise.finished';
  constructor(userId: string, exercise: Exercise) {
    super(ExerciseFinishedEvent.EventName, userId, { exercise });
  }
}
