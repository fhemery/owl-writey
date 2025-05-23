import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Request,
  Sse,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Auth,
  AuthService,
  RequestWithUser,
  UserNotFoundException,
} from '@owl/back/auth';
import { EventEmitterFacade } from '@owl/back/infra/events';
import { SseNotificationService } from '@owl/back/infra/sse';
import {
  HeartbeatEvent,
  Role,
  SseEvent,
  UserDto,
} from '@owl/shared/common/contracts';
import { Observable } from 'rxjs';

import { UserToCreateDtoImpl } from './dtos/user-to-create.dto.impl';
import { UserDeletedEvent } from './model';
import { User } from './model/user';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly notificationService: SseNotificationService,
    private readonly eventEmitter: EventEmitterFacade
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

  @Delete(':uid')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('uid') uid: string,
    @Request() request: RequestWithUser
  ): Promise<void> {
    if (request.user.uid !== uid && !request.user.roles.includes(Role.Admin)) {
      throw new ForbiddenException();
    }

    try {
      await this.userService.delete(uid);
      await this.authService.delete(uid);

      this.eventEmitter.emit(new UserDeletedEvent(uid));
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
