import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';
import { EventsModule } from '@owl/back/infra/events';
import { ServerSentEventsModule } from '@owl/back/infra/sse';
import { TrackingModule } from '@owl/back/tracking';
import { UsersModule } from '@owl/back/user';

import {
  CancelTurnCommand,
  CreateExerciseCommand,
  DeleteAllExercisesFromUserCommand,
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
import { ExerciseEventHandlers } from './infra/event-handlers/exercise.event-handlers';
import { ExquisiteCorpseEventHandlers } from './infra/event-handlers/exquisite-corpse.event-handlers';
import { ExerciseTrackingListener } from './infra/tracking/exercise-tracking-listener';
import { ExquisiteCorpseTrackingListener } from './infra/tracking/exquisite-corpse-tracking-listener';
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
    TrackingModule,
  ],
  controllers: [
    ExercisesController,
    ExerciseParticipantsController,
    ExquisiteCorpseController,
  ],
  providers: [
    ExerciseEventHandlers,
    ExquisiteCorpseEventHandlers,
    { provide: ExerciseRepository, useClass: ExerciseTypeOrmRepository },
    { provide: ExerciseUserFacade, useClass: UserFacadeImpl },
    ListExercisesQuery,
    CreateExerciseCommand,
    GetExerciseQuery,
    DeleteExerciseCommand,
    FinishExerciseCommand,
    DeleteAllExercisesFromUserCommand,
    TakeTurnCommand,
    SubmitTurnCommand,
    CancelTurnCommand,
    ExerciseTrackingListener,
    ExquisiteCorpseTrackingListener,
  ],
  exports: [],
})
export class ExercisesModule {}
