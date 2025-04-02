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
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ValidateNested()
  @Type(() => NovelGeneralInfoDtoImpl)
  generalInfo!: NovelGeneralInfoDtoImpl;

  @IsArray()
  participants!: NovelParticipantDto[];

  @IsArray()
  chapters!: ChapterDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => NovelUniverseDtoImpl)
  universe?: NovelUniverseDtoImpl;
}
