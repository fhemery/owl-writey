import { ExerciseType } from '@owl/shared/exercises/contracts';

import { ExerciseBaseTrackingEvent } from './exercise-base-tracking-event';

interface ExerciseCreatedTrackingEventData {
  type: ExerciseType;
}

export class ExerciseCreatedTrackingEvent extends ExerciseBaseTrackingEvent<ExerciseCreatedTrackingEventData> {
  constructor(
    exerciseId: string,
    data: ExerciseCreatedTrackingEventData,
    userId: string
  ) {
    super('exercise.created', exerciseId, data, userId);
  }
}
