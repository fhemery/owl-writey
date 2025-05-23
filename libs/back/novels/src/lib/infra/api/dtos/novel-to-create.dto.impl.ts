import { ApiProperty } from '@nestjs/swagger';
import { NovelToCreateDto } from '@owl/shared/novels/contracts';
import { IsString, MinLength } from 'class-validator';

export class NovelToCreateDtoImpl implements NovelToCreateDto {
  @ApiProperty({
    description: 'The title of the novel to create',
    example: 'The Great Adventure',
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({
    description: 'A brief description of the novel',
    required: false,
    example: 'An epic tale of adventure and discovery'
  })
  @IsString()
  description!: string;
}
