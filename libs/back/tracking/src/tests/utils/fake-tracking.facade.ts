import { ResettableMock } from '@owl/back/test-utils';

import { TrackingEvent, TrackingFacade } from '../../lib/domain';

export class FakeTrackingFacade implements TrackingFacade, ResettableMock {
  events: TrackingEvent[] = [];

  trackEvent(event: TrackingEvent): Promise<void> {
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
