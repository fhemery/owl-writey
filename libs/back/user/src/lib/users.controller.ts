import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { UserDto, UserToCreateDto } from '@owl/shared/contracts';
import { IsNotEmpty, IsString } from 'class-validator';

import { UserRepository } from './user.repository';

class UserToCreateDtoImpl implements UserToCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get(':id')
  @Auth()
  async getUser(
    @Param('id') id: string,
    @Request() request: RequestWithUser
  ): Promise<UserDto> {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.uid != request.user.uid) {
      delete user.email;
    }
    return user;
  }

  @Post('')
  @Auth()
  async createUser(
    @Body() user: UserToCreateDtoImpl,
    @Request() request: RequestWithUser
  ): Promise<void> {
    const { uid, email } = request.user;
    if (!uid || !email) {
      throw new InternalServerErrorException('User has not been authenticated');
    }
    await this.userRepository.createUser({ uid, email, name: user.name });

    request.res?.set('Location', `/api/users/${uid}`);
  }
}
