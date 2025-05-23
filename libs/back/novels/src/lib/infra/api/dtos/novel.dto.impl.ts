import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ChapterDto,
  NovelDto,
  NovelParticipantDto,
} from '@owl/shared/novels/contracts';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { NovelGeneralInfoDtoImpl } from './novel-general-info.dto.impl';
import { NovelUniverseDtoImpl } from './novel-universe.dto.impl';

export class NovelDtoImpl implements NovelDto {
  @ApiProperty({
    description: 'The unique identifier of the novel',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: 'General information about the novel',
    type: NovelGeneralInfoDtoImpl,
  })
  @ValidateNested()
  @Type(() => NovelGeneralInfoDtoImpl)
  generalInfo!: NovelGeneralInfoDtoImpl;

  @ApiProperty({
    description: 'List of participants in the novel',
  })
  @IsArray()
  participants!: NovelParticipantDto[];

  @ApiProperty({
    description: 'List of chapters in the novel',
  })
  @IsArray()
  chapters!: ChapterDto[];

  @ApiPropertyOptional({
    description: 'The universe of the novel including characters and settings',
    type: NovelUniverseDtoImpl,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NovelUniverseDtoImpl)
  universe?: NovelUniverseDtoImpl;
}
