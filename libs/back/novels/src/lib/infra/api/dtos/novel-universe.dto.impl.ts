import { ApiProperty } from '@nestjs/swagger';
import { NovelUniverseDto } from '@owl/shared/novels/contracts';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { NovelCharacterDtoImpl } from './novel-character.dto.impl';

export class NovelUniverseDtoImpl implements NovelUniverseDto {
  @ApiProperty({
    description: 'List of characters in the novel universe',
    type: [NovelCharacterDtoImpl],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        description: 'A brave knight',
        tags: ['hero', 'protagonist'],
        properties: {}
      }
    ]
  })
  @ValidateNested({ each: true })
  @Type(() => NovelCharacterDtoImpl)
  characters!: NovelCharacterDtoImpl[];
}
