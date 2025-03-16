import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Request,
  Sse,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { SseNotificationService } from '@owl/back/websocket';
import {
  HeartbeatEvent,
  SseEvent,
  UserDto,
  UserToCreateDto,
} from '@owl/shared/contracts';
import { IsNotEmpty, IsString } from 'class-validator';
import { Observable } from 'rxjs';

import { User } from './model/user';
import { UsersService } from './users.service';

class UserToCreateDtoImpl implements UserToCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: SseNotificationService
  ) {}

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

  @Auth()
  @Sse(':id/events')
  async getEvents(
    @Req() request: RequestWithUser
  ): Promise<Observable<{ data: SseEvent }>> {
    const stream = this.notificationService.registerUser(request.user.uid);

    const heartbeatInterval = setInterval(() => {
      stream.next({
        data: new HeartbeatEvent(),
      });
    }, 50000);

    request.res?.on('close', () => {
      clearInterval(heartbeatInterval);
      stream.complete();
    });

    return Promise.resolve(stream);
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
