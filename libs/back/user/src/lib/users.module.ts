import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';
import { WebsocketModule } from '@owl/back/websocket';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    WebsocketModule,
  ],
  controllers: [UsersController],
  providers: [UserRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
