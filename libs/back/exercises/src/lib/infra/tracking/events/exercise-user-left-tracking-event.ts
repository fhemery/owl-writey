import { ExerciseBaseTrackingEvent } from './exercise-base-tracking-event';

export class ExerciseUserLeftTrackingEvent extends ExerciseBaseTrackingEvent {
  static EventName = 'exercise.user-left';
  constructor(exerciseId: string, userId: string) {
    super(ExerciseUserLeftTrackingEvent.EventName, exerciseId, {}, userId);
  }
}
