import { ExerciseBaseTrackingEvent } from '../exercise-base-tracking-event';

export class ExquisiteCorpseTurnTakenTrackingEvent extends ExerciseBaseTrackingEvent {
  static readonly EventName = 'exquisite-corpse.turn-taken';

  constructor(exerciseId: string, userId: string) {
    super(
      ExquisiteCorpseTurnTakenTrackingEvent.EventName,
      exerciseId,
      {},
      userId
    );
  }
}
