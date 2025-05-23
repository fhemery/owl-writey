import { ApiProperty } from '@nestjs/swagger';
import {
  NovelCharacterDto,
  NovelCharacterPropertiesDto,
} from '@owl/shared/novels/contracts';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class NovelCharacterDtoImpl implements NovelCharacterDto {
  @ApiProperty({
    description: 'The unique identifier of the character',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: 'The name of the character',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Detailed description of the character',
    required: false,
    example: 'A brave knight from the northern kingdom'
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'List of tags associated with the character',
    type: [String],
    example: ['protagonist', 'knight']
  })
  @IsArray()
  tags!: string[];

  @ApiProperty({
    description: 'Additional properties of the character',
    type: Object
  })
  @IsObject()
  properties!: NovelCharacterPropertiesDto;
}
