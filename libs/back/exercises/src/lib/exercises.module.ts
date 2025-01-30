import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@owl/back/user';

import { ExerciseParticipantEntity } from './entities/exercice-participant.entity';
import { ExerciseEntity } from './entities/exercise.entity';
import { ExerciseRepository } from './exercise.repository';
import { ExercisesController } from './exercises.controller';
import { WsGatewayGateway } from './ws-gateway.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseEntity, ExerciseParticipantEntity]),
    UsersModule,
  ],
  controllers: [ExercisesController],
  providers: [ExerciseRepository, WsGatewayGateway],
  exports: [],
})
export class ExercisesModule {}
