import { TrackingEvent } from '@owl/back/tracking';

export class NovelBaseTrackingEvent<
  T extends object = object
> extends TrackingEvent<T | { novelId: string }> {
  constructor(
    eventName: string,
    readonly novelId: string,
    data: T,
    userId: string
  ) {
    super(eventName, { novelId, ...data }, userId);
  }
}
