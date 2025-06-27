import { TrackingEvent } from '@owl/back/tracking';

export class UserCreatedTrackingEvent extends TrackingEvent {
  static EventName = 'User:Created';

  constructor(uid: string) {
    super(UserCreatedTrackingEvent.EventName, { uid }, uid);
  }
}
