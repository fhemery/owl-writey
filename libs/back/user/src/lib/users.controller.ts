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

import { User } from './model/user';
import { UsersService } from './users.service';

class UserToCreateDtoImpl implements UserToCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @Auth()
  async getUser(
    @Param('id') id: string,
    @Request() request: RequestWithUser
  ): Promise<UserDto> {
    const user = await this.userService.get(id);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      ...user,
      email: user.uid !== request.user.uid ? undefined : user.email,
    };
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
    await this.userService.create(new User(uid, email, user.name));

    request.res?.set('Location', `/api/users/${uid}`);
  }
}
