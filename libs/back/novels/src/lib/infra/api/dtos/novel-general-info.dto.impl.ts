import { ApiProperty } from '@nestjs/swagger';
import { NovelGeneralInfoDto } from '@owl/shared/novels/contracts';
import { IsNotEmpty, IsString } from 'class-validator';

export class NovelGeneralInfoDtoImpl implements NovelGeneralInfoDto {
  @ApiProperty({
    description: 'The title of the novel',
    example: 'The Great Adventure',
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'A brief description of the novel',
    required: false,
    example: 'An epic tale of adventure and discovery'
  })
  @IsString()
  description!: string;
}
