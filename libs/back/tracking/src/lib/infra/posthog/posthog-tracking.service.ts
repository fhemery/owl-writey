import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

import { TrackingFacade } from '../../domain';
import { TrackingEvent } from '../../domain/model';

/**
 * PostHog tracking service implementation
 * Handles sending tracking events to PostHog
 */
@Injectable()
export class PosthogTrackingService implements TrackingFacade, OnModuleDestroy {
  private readonly logger = new Logger(PosthogTrackingService.name);
  private readonly client: PostHog;

  constructor(private readonly configService: ConfigService) {
    // Initialize PostHog client with API key and host from environment variables
    const apiKey = this.configService.get<string>('POSTHOG_API_KEY');
    const host = this.configService.get<string>(
      'POSTHOG_HOST',
      'https://eu.i.posthog.com'
    );

    if (!apiKey) {
      this.logger.warn(
        'PostHog API key not provided. Tracking will be disabled.'
      );
      // Create a dummy client that doesn't send events
      this.client = {
        capture: () => Promise.resolve(),
        shutdown: () => Promise.resolve(),
      } as unknown as PostHog;
      return;
    }

    this.client = new PostHog(apiKey, { host });
    this.logger.log('PostHog tracking service initialized');
  }

  /**
   * Track an event in PostHog
   * @param event The event to track
   */
  async trackEvent<T>(event: TrackingEvent<T>): Promise<void> {
    try {
      await this.client.capture({
        distinctId: event.userId || 'anonymous',
        event: event.eventName,
        properties: {
          ...event.data,
          sessionId: event.sessionId,
          timestamp: event.timestamp
            ? event.timestamp.toISOString()
            : new Date().toISOString(),
        },
      });
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to track event: ${err.message}`, err.stack);
    }
  }

  /**
   * Shutdown the PostHog client (flush events)
   */
  async shutdown(): Promise<void> {
    try {
      await this.client.shutdown();
      this.logger.log('PostHog client shut down successfully');
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to shut down PostHog client: ${err.message}`,
        err.stack
      );
    }
  }

  /**
   * Ensure client is shut down when module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    await this.shutdown();
  }
}
