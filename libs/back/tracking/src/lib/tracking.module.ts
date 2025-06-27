import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TrackingFacade } from './domain';
import { TrackingService } from './domain';
import { TrackingController } from './infra/api/tracking.controller';
import { FakeTrackingFacade } from './infra/tracking-facades/fake-tracker/fake-tracking.facade';
import { PosthogTrackingService } from './infra/tracking-facades/posthog-tracker/posthog-tracking.service';

@Module({
  imports: [ConfigModule],
  controllers: [TrackingController],
  providers: [
    TrackingService,
    {
      provide: TrackingFacade,
      useClass:
        process.env['POSTHOG_ENABLED'] === '1'
          ? PosthogTrackingService
          : FakeTrackingFacade,
    },
  ],
  exports: [TrackingService, TrackingFacade],
})
export class TrackingModule {}
