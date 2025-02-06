import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';
import { UsersModule } from '@owl/back/user';
import { WebsocketModule } from '@owl/back/websocket';

import {
  ExerciseContentEntity,
  ExerciseEntity,
  ExerciseParticipantEntity,
} from './entities';
import { ExerciseEventListeners } from './exercise.event-listeners';
import { ExerciseRepository } from './exercise.repository';
import { ExercisesController } from './exercises.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseEntity,
      ExerciseParticipantEntity,
      ExerciseContentEntity,
    ]),
    AuthModule,
    UsersModule,
    WebsocketModule,
  ],
  controllers: [ExercisesController],
  providers: [ExerciseRepository, ExerciseEventListeners],
  exports: [],
})
export class ExercisesModule {}
