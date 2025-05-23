import { ApiProperty } from '@nestjs/swagger';
import { NovelEventToPushDto } from '@owl/shared/novels/contracts';
import { IsObject, IsString } from 'class-validator';

export class NovelEventToPushDtoImpl implements NovelEventToPushDto {
  @ApiProperty({
    description: 'The unique identifier of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  readonly eventId!: string;

  @ApiProperty({
    description: 'The name of the event',
    example: 'Novel:chapterCreated',
  })
  @IsString()
  readonly eventName!: string;

  @ApiProperty({
    description: 'The version of the event',
    example: '1',
  })
  @IsString()
  readonly eventVersion!: string;

  @ApiProperty({
    description: 'The data of the event',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Chapter 1',
      content: 'Once upon a time...',
    },
  })
  @IsObject()
  readonly data: unknown;
}
