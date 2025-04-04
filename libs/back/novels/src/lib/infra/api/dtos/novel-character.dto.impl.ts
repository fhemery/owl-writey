import { NovelCharacterDto } from '@owl/shared/novels/contracts';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class NovelCharacterDtoImpl implements NovelCharacterDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  tags!: string[];
}
