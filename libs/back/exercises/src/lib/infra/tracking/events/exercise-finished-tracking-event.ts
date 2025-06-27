import { ExerciseBaseTrackingEvent } from './exercise-base-tracking-event';

export class ExerciseFinishedTrackingEvent extends ExerciseBaseTrackingEvent {
  static readonly EventName = 'exercise.finished';

  constructor(exerciseId: string, userId: string) {
    super(ExerciseFinishedTrackingEvent.EventName, exerciseId, {}, userId);
  }
}
