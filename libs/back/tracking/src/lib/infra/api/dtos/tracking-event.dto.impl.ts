import { ApiProperty } from '@nestjs/swagger';
import { TrackingEventDto } from '@owl/shared/common/contracts';
import { IsNotEmpty, IsString } from 'class-validator';

export class TrackingEventDtoImpl implements TrackingEventDto {
  @ApiProperty({
    description: 'The name of the event',
    example: 'pageView',
  })
  @IsString()
  @IsNotEmpty()
  eventName!: string;

  @ApiProperty({
    description: 'The data of the event',
    example: {
      page: 'home',
    },
  })
  data!: Record<string, unknown>;
}
