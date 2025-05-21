import { Logger } from '@nestjs/common';

import { TrackingEvent, TrackingFacade } from '../../../domain';

export class FakeTrackingFacade implements TrackingFacade {
  private readonly logger = new Logger(FakeTrackingFacade.name);

  events: TrackingEvent[] = [];

  trackEvent(event: TrackingEvent): Promise<void> {
    this.logger.log(
      `Tracking event: ${event.eventName} - ${JSON.stringify(event.data)}`
    );
    this.events.push(event);
    return Promise.resolve();
  }

  hasEvent(eventName: string): boolean {
    return this.events.some((event) => event.eventName === eventName);
  }

  getByName(eventName: string): TrackingEvent[] {
    return this.events.filter((event) => event.eventName === eventName);
  }

  reset(): Promise<void> {
    this.events = [];
    return Promise.resolve();
  }
}
