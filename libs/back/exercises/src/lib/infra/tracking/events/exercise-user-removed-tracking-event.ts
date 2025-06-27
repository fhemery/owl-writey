import { ExerciseBaseTrackingEvent } from './exercise-base-tracking-event';

export class ExerciseUserRemovedTrackingEvent extends ExerciseBaseTrackingEvent<{
  removedUserId: string;
}> {
  static EventName = 'exercise.user-removed';
  constructor(
    exerciseId: string,
    currentUserId: string,
    removedUserId: string
  ) {
    super(
      ExerciseUserRemovedTrackingEvent.EventName,
      exerciseId,
      { removedUserId },
      currentUserId
    );
  }
}
