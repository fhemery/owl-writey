import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { RequestWithUser } from '@owl/back/auth';
import {
  TrackingEventDto,
  TrackingRequestDto,
} from '@owl/shared/common/contracts';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { TrackingEvent, TrackingService } from '../../domain';

class TrackingRequestDtoImpl implements TrackingRequestDto {
  @IsNotEmpty()
  @Type(() => TrackingEventDtoImpl)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  events!: TrackingEventDtoImpl[];

  @IsString()
  @IsOptional()
  sessionId?: string;
}

class TrackingEventDtoImpl implements TrackingEventDto {
  @IsString()
  @IsNotEmpty()
  eventName!: string;

  data!: Record<string, unknown>;
}

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
