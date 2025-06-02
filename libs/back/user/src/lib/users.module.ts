import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';
import { EventsModule } from '@owl/back/infra/events';
import { ServerSentEventsModule } from '@owl/back/infra/sse';
import { TrackingModule } from '@owl/back/tracking';

import { UserTrackingEventListeners } from './tracking/user-tracking-event-listeners';
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
    TrackingModule,
  ],
  controllers: [UsersController, UserRolesController],
  providers: [UserRepository, UsersService, UserTrackingEventListeners],
  exports: [UsersService],
})
export class UsersModule {}
