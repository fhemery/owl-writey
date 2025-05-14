import { NovelUniverseDto } from '@owl/shared/novels/contracts';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { NovelCharacterDtoImpl } from './novel-character.dto.impl';

export class NovelUniverseDtoImpl implements NovelUniverseDto {
  @ValidateNested({ each: true })
  @Type(() => NovelCharacterDtoImpl)
  characters!: NovelCharacterDtoImpl[];
}
