import { ExerciseBaseTrackingEvent } from '../exercise-base-tracking-event';

export class ExquisiteCorpseContentSubmittedTrackingEvent extends ExerciseBaseTrackingEvent<{
  nbWords: number;
}> {
  static readonly EventName = 'exquisite-corpse.content-submitted';

  constructor(exerciseId: string, userId: string, nbWords: number) {
    super(
      ExquisiteCorpseContentSubmittedTrackingEvent.EventName,
      exerciseId,
      { nbWords },
      userId
    );
  }
}
