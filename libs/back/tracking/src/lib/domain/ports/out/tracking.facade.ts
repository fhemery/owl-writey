import { TrackingEvent } from '../../model';

export const TrackingFacade = Symbol('TrackingFacade');
export interface TrackingFacade {
  /**
   * Track an event
   * @param event The event to track
   * @returns A promise that resolves when the event has been tracked
   */
  trackEvent<T>(event: TrackingEvent<T>): Promise<void>;
}
