import { Inject, Injectable, Logger } from '@nestjs/common';

import { TrackingEvent } from '../../model';
import { TrackingFacade } from '../out/tracking.facade';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(
    @Inject(TrackingFacade)
    private readonly trackingFacade: TrackingFacade
  ) {}

  async trackEvent<T>(event: TrackingEvent<T>): Promise<void> {
    try {
      await this.trackingFacade.trackEvent(event);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to track event: ${err.message}`, err.stack);
    }
  }

  async trackEvents<T>(events: TrackingEvent<T>[]): Promise<void> {
    for (const event of events) {
      await this.trackEvent(event);
    }
  }
}
