import { TrackingEvent } from '@owl/back/tracking';

export class UserDeletedTrackingEvent extends TrackingEvent {
  static EventName = 'User:Deleted';

  constructor(uid: string) {
    super(UserDeletedTrackingEvent.EventName, { uid }, uid);
  }
}
