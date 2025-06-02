import { ExerciseBaseTrackingEvent } from './exercise-base-tracking-event';

export class ExerciseDeletedTrackingEvent extends ExerciseBaseTrackingEvent {
  static readonly EventName = 'exercise.deleted';

  constructor(exerciseId: string, userId: string) {
    super(ExerciseDeletedTrackingEvent.EventName, exerciseId, {}, userId);
  }
}
