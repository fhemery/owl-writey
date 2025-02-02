import { NovelToCreateDto } from '@owl/shared/contracts';
import { IsString, MinLength } from 'class-validator';

export class NovelToCreateDtoImpl implements NovelToCreateDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  description!: string;
}
