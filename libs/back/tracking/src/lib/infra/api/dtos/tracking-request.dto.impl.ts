import { ApiProperty } from '@nestjs/swagger';
import { TrackingRequestDto } from '@owl/shared/common/contracts';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { TrackingEventDtoImpl } from './tracking-event.dto.impl';

export class TrackingRequestDtoImpl implements TrackingRequestDto {
  @ApiProperty({
    description: 'The events to track',
    type: [TrackingEventDtoImpl],
    example: [
      {
        eventName: 'pageView',
        data: {
          page: 'home',
        },
      },
    ],
  })
  @IsNotEmpty()
  @Type(() => TrackingEventDtoImpl)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  events!: TrackingEventDtoImpl[];

  @ApiProperty({
    description: 'The session id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionId?: string;
}
