import { ExerciseBaseTrackingEvent } from './exercise-base-tracking-event';

export class ExerciseUserJoinedTrackingEvent extends ExerciseBaseTrackingEvent {
  static EventName = 'exercise.user-joined';
  constructor(exerciseId: string, userId: string) {
    super(ExerciseUserJoinedTrackingEvent.EventName, exerciseId, {}, userId);
  }
}
