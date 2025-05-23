import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { RequestWithUser } from '@owl/back/auth';

import { TrackingEvent, TrackingService } from '../../domain';
import { TrackingRequestDtoImpl } from './dtos/tracking-request.dto.impl';

/**
 * We call it events to try to avoid the browsers to block it
 */
@Controller('events')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('')
  @HttpCode(204)
  async trackEvent(
    @Body() request: TrackingRequestDtoImpl,
    @Req() req: RequestWithUser
  ): Promise<void> {
    const events: TrackingEvent<unknown>[] = request.events.map(
      (event) =>
        new TrackingEvent(
          event.eventName,
          event.data,
          req.user?.uid,
          request.sessionId
        )
    );

    await this.trackingService.trackEvents(events);
  }
}
