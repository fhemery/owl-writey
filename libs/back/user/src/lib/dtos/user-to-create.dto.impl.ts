import { ApiProperty } from '@nestjs/swagger';
import { UserToCreateDto } from '@owl/shared/common/contracts';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserToCreateDtoImpl implements UserToCreateDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
