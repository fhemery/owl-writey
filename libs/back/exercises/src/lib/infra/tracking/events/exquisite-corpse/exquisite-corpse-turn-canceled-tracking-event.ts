import { ExerciseBaseTrackingEvent } from '../exercise-base-tracking-event';

export class ExquisiteCorpseTurnCanceledTrackingEvent extends ExerciseBaseTrackingEvent<{
  cancelingUserId: string;
}> {
  static readonly EventName = 'exquisite-corpse.turn-canceled';

  constructor(exerciseId: string, userId: string, cancelingUserId: string) {
    super(
      ExquisiteCorpseTurnCanceledTrackingEvent.EventName,
      exerciseId,
      { cancelingUserId },
      userId
    );
  }
}
