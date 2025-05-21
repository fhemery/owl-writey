import { TrackingEvent } from '@owl/back/tracking';

export class NovelBaseTrackingEvent<T extends object> extends TrackingEvent<
  T | { novelId: string }
> {
  constructor(eventName: string, readonly novelId: string, data: T) {
    super(eventName, { novelId, ...data }, novelId);
  }
}
