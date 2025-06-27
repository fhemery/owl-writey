export class TrackingEvent<T = unknown> {
  constructor(
    readonly eventName: string,
    readonly data: T,
    readonly userId?: string,
    readonly sessionId?: string,
    readonly timestamp: Date = new Date()
  ) {}
}
