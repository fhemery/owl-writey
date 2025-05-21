import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Sse,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { HeartbeatEvent, SseEvent } from '@owl/shared/common/contracts';
import {
  NovelEventToPushDto,
  NovelSseEvent,
} from '@owl/shared/novels/contracts';
import { NovelDomainEventFactory } from '@owl/shared/novels/model';
import { IsObject, IsString } from 'class-validator';
import { Observable } from 'rxjs';

import { NovelNotFoundException } from '../../domain/model';
import { NovelApplyEventCommand } from '../../domain/ports';
import { GetNovelEventsQuery } from '../../domain/ports/in/query';

class NovelEventToPushDtoImpl implements NovelEventToPushDto {
  @IsString()
  readonly eventId!: string;

  @IsString()
  readonly eventName!: string;
  @IsString()
  readonly eventVersion!: string;
  @IsObject()
  readonly data: unknown;
}

@Controller('novels/:id/events')
@ApiBearerAuth()
export class NovelEventsController {
  constructor(
    private readonly sendEventCommand: NovelApplyEventCommand,
    private readonly getNovelEventsQuery: GetNovelEventsQuery
  ) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendEvent(
    @Param('id') id: string,
    @Body() event: NovelEventToPushDtoImpl,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      const domainEvent = NovelDomainEventFactory.From(
        event.eventName,
        event.eventVersion,
        event.data,
        request.user.uid,
        event.eventId
      );
      await this.sendEventCommand.execute(id, request.user.uid, domainEvent);
    } catch (error) {
      if (error instanceof NovelNotFoundException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  @Sse()
  @Auth()
  async getEvents(
    @Param('id') novelId: string,
    @Req() request: RequestWithUser
  ): Promise<Observable<{ data: SseEvent }>> {
    try {
      const events = await this.getNovelEventsQuery.execute(
        novelId,
        request.user.uid
      );

      // Create an Observable that will emit our events
      return new Observable<{ data: SseEvent }>((observer) => {
        let heartbeatInterval: NodeJS.Timeout | null = null;

        // Use setTimeout to ensure the client has time to establish the connection
        const initialTimeout = setTimeout(() => {
          // Send the initial data after a delay
          observer.next({ data: new NovelSseEvent(events) });

          // Set up heartbeat to keep connection alive
          heartbeatInterval = setInterval(() => {
            observer.next({ data: new HeartbeatEvent() });
          }, 30000);
        }, 100); // 500ms delay to ensure connection is established

        // Return a cleanup function
        return () => {
          clearTimeout(initialTimeout);
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
          }
        };
      });
    } catch (error) {
      if (error instanceof NovelNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
