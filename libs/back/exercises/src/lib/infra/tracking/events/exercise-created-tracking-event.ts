import { ExerciseType } from '@owl/shared/exercises/contracts';

import { ExerciseBaseTrackingEvent } from './exercise-base-tracking-event';

interface ExerciseCreatedTrackingEventData {
  type: ExerciseType;
}

export class ExerciseCreatedTrackingEvent extends ExerciseBaseTrackingEvent<ExerciseCreatedTrackingEventData> {
  static readonly EventName = 'exercise.created';

  constructor(
    exerciseId: string,
    data: ExerciseCreatedTrackingEventData,
    userId: string
  ) {
    super(ExerciseCreatedTrackingEvent.EventName, exerciseId, data, userId);
  }
}
