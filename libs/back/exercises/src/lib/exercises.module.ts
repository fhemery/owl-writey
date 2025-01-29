import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseParticipantEntity } from './entities/exercice-participant.entity';
import { ExerciseEntity } from './entities/exercise.entity';
import { ExerciseRepository } from './exercise.repository';
import { ExercisesController } from './exercises.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseEntity, ExerciseParticipantEntity]),
  ],
  controllers: [ExercisesController],
  providers: [ExerciseRepository],
  exports: [],
})
export class ExercisesModule {}
