import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { NovelEventDto } from '@owl/shared/novels/contracts';
import { NovelDomainEventFactory } from '@owl/shared/novels/model';
import { IsObject, IsString } from 'class-validator';

import { NovelNotFoundException } from '../../domain/model';
import { NovelApplyEventCommand } from '../../domain/ports';

class NovelEventDtoImpl implements NovelEventDto {
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
  constructor(private readonly sendEventCommand: NovelApplyEventCommand) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendEvent(
    @Param('id') id: string,
    @Body() event: NovelEventDtoImpl,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      const domainEvent = NovelDomainEventFactory.From(
        event.eventName,
        event.eventVersion,
        event.data
      );
      await this.sendEventCommand.execute(id, request.user.uid, domainEvent);
    } catch (error) {
      if (error instanceof NovelNotFoundException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
