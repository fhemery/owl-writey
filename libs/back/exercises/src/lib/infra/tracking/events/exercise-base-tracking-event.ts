import { TrackingEvent } from '@owl/back/tracking';

export class ExerciseBaseTrackingEvent<
  T extends object = object
> extends TrackingEvent<T | { exerciseId: string }> {
  constructor(
    eventName: string,
    readonly exerciseId: string,
    data: T,
    userId: string
  ) {
    super(eventName, { exerciseId, ...data }, userId);
  }
}
