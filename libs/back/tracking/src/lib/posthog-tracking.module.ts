import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@owl/back/user';

import { TrackingFacade } from './domain';
import { TrackingService } from './domain';
import { TrackingController } from './infra/api/tracking.controller';
import { PosthogTrackingService } from './infra/posthog/posthog-tracking.service';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [TrackingController],
  providers: [
    TrackingService,
    PosthogTrackingService,
    {
      provide: TrackingFacade,
      useClass: PosthogTrackingService,
    },
  ],
  exports: [TrackingService, TrackingFacade],
})
export class PostHogTrackingModule {}
