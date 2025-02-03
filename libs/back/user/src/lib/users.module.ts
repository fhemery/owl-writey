import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UsersController],
  providers: [UserRepository, UsersController, UsersService],
  exports: [UsersController, UsersService], // TODO remove UsersController from here, replacing with userService
})
export class UsersModule {}
