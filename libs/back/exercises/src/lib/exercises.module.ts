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
import { ExerciseRepository } from './exercise.repository';
import { ExerciseParticipantsController } from './infra/api/exercise-participants.controller';
import { ExercisesController } from './infra/api/exercises.controller';
import { ExquisiteCorpseEventHandlers } from './infra/event-handlers/exercise.event-listeners';

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
  controllers: [ExercisesController, ExerciseParticipantsController],
  providers: [ExerciseRepository, ExquisiteCorpseEventHandlers],
  exports: [],
})
export class ExercisesModule {}
