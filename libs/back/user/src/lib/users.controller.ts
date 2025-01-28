import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Auth } from '@owl/back/auth';
import { UserDto } from '@owl/shared/contracts';

@Controller('users')
export class UsersController {
  @Get(':id')
  @Auth()
  getUser(@Param('id') id: string): Promise<UserDto> {
    throw new NotFoundException();
  }
}
