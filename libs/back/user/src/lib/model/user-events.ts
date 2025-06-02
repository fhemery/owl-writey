import { EmittedEvent } from '@owl/back/infra/events';

export class UserDeletedEvent implements EmittedEvent<{ uid: string }> {
  static eventName = 'User:Deleted';
  name = UserDeletedEvent.eventName;
  payload: { uid: string };

  constructor(uid: string) {
    this.payload = { uid };
  }
}

export class UserCreatedEvent implements EmittedEvent<{ uid: string }> {
  static eventName = 'User:Created';
  name = UserCreatedEvent.eventName;
  payload: { uid: string };

  constructor(uid: string) {
    this.payload = { uid };
  }
}
