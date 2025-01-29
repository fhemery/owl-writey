import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UsersController],
  providers: [UserRepository, UsersController],
  exports: [UsersController],
})
export class UsersModule {}
