import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';
import { EventsModule } from '@owl/back/infra/events';
import { ServerSentEventsModule } from '@owl/back/infra/sse';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRolesController } from './user-roles.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    ServerSentEventsModule,
    EventsModule,
  ],
  controllers: [UsersController, UserRolesController],
  providers: [UserRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
