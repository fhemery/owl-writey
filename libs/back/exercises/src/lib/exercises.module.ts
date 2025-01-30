import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@owl/back/user';

import {
  ExerciseContentEntity,
  ExerciseEntity,
  ExerciseParticipantEntity,
} from './entities';
import { ExerciseEventListeners } from './exercise.event-listeners';
import { ExerciseRepository } from './exercise.repository';
import { ExercisesController } from './exercises.controller';
import { WsGatewayGateway } from './ws-gateway.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseEntity,
      ExerciseParticipantEntity,
      ExerciseContentEntity,
    ]),
    UsersModule,
  ],
  controllers: [ExercisesController],
  providers: [ExerciseRepository, WsGatewayGateway, ExerciseEventListeners],
  exports: [],
})
export class ExercisesModule {}
