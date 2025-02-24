import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@owl/back/auth';
import { UsersModule } from '@owl/back/user';
import { WebsocketModule } from '@owl/back/websocket';

import {
  CancelTurnCommand,
  ConnectToExquisiteCorpseCommand,
  CreateExerciseCommand,
  DeleteExerciseCommand,
  ExerciseRepository,
  ExerciseUserFacade,
  GetExerciseQuery,
  ListExercisesQuery,
  NotificationFacade,
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
import { ExerciseTypeOrmRepository } from './infra/database/exercise-typeorm.repository';
import { ExquisiteCorpseEventHandlers } from './infra/event-handlers/exquisite-corpse.event-handlers';
import { WsNotificationsImpl } from './infra/notifications/ws-notifications.impl';
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
    WebsocketModule,
  ],
  controllers: [ExercisesController, ExerciseParticipantsController],
  providers: [
    ExquisiteCorpseEventHandlers,
    { provide: ExerciseRepository, useClass: ExerciseTypeOrmRepository },
    { provide: ExerciseUserFacade, useClass: UserFacadeImpl },
    { provide: NotificationFacade, useClass: WsNotificationsImpl },
    ListExercisesQuery,
    CreateExerciseCommand,
    GetExerciseQuery,
    DeleteExerciseCommand,
    ConnectToExquisiteCorpseCommand,
    TakeTurnCommand,
    SubmitTurnCommand,
    CancelTurnCommand,
  ],
  exports: [],
})
export class ExercisesModule {}
