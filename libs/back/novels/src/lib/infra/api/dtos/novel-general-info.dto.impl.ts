import { NovelGeneralInfoDto } from '@owl/shared/novels/contracts';
import { IsNotEmpty, IsString } from 'class-validator';

export class NovelGeneralInfoDtoImpl implements NovelGeneralInfoDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;
}
