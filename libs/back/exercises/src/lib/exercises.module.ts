import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';
import { EventsModule } from '@owl/back/infra/events';
import { ServerSentEventsModule } from '@owl/back/infra/sse';
import { UsersModule } from '@owl/back/user';

import {
  CancelTurnCommand,
  CreateExerciseCommand,
  DeleteExerciseCommand,
  ExerciseRepository,
  ExerciseUserFacade,
  FinishExerciseCommand,
  GetExerciseQuery,
  ListExercisesQuery,
  SubmitTurnCommand,
  TakeTurnCommand,
} from './domain/ports';
import {
  ExerciseContentEntity,
  ExerciseEntity,
  ExerciseParticipantEntity,
} from './entities';
import { ExerciseParticipantsController } from './infra/api/exercise-participants.controller';
import { ExercisesController } from './infra/api/exercises.controller';
import { ExquisiteCorpseController } from './infra/api/exquisite-corpse.controller';
import { ExerciseTypeOrmRepository } from './infra/database/exercise-typeorm.repository';
import { ExquisiteCorpseEventHandlers } from './infra/event-handlers/exquisite-corpse.event-handlers';
import { UserFacadeImpl } from './infra/user/user.facade.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseEntity,
      ExerciseParticipantEntity,
      ExerciseContentEntity,
    ]),
    AuthModule,
    UsersModule,
    EventsModule,
    ServerSentEventsModule,
  ],
  controllers: [
    ExercisesController,
    ExerciseParticipantsController,
    ExquisiteCorpseController,
  ],
  providers: [
    ExquisiteCorpseEventHandlers,
    { provide: ExerciseRepository, useClass: ExerciseTypeOrmRepository },
    { provide: ExerciseUserFacade, useClass: UserFacadeImpl },
    ListExercisesQuery,
    CreateExerciseCommand,
    GetExerciseQuery,
    DeleteExerciseCommand,
    FinishExerciseCommand,
    TakeTurnCommand,
    SubmitTurnCommand,
    CancelTurnCommand,
  ],
  exports: [],
})
export class ExercisesModule {}
