export class SseEvent<T = unknown> {
  constructor(readonly event: string, readonly data: T) {}
}

export class HeartbeatEvent extends SseEvent {
  constructor() {
    super('heartbeat', null);
  }
}

export class NotificationEvent extends SseEvent<{
  key: string;
  data: Record<string, unknown>;
  uid?: string;
}> {
  static readonly eventName = 'notification';
  constructor(key: string, data: Record<string, unknown>, uid?: string) {
    super(NotificationEvent.eventName, { key, data, uid });
  }
}
