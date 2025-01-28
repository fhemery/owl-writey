import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { UserDto, UserToCreateDto } from '@owl/shared/contracts';

import { UserRepository } from './user.repository';

@Controller('users')
export class UsersController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get(':id')
  @Auth()
  async getUser(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post('')
  @Auth()
  async createUser(
    @Body() user: UserToCreateDto,
    @Request() request: RequestWithUser
  ): Promise<void> {
    const { uid, email } = request.user;
    await this.userRepository.createUser({ uid, email, name: user.name });

    request.res?.set('Location', `/api/users/${uid}`);
  }
}
