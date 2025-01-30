import { ExerciseType } from '@owl/shared/contracts';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Exercise } from '../model/exercise';
import { ExerciseFactory } from '../model/exercise-factory';
import { ExerciseParticipantEntity } from './exercise-participant.entity';

@Entity({ name: 'exercises' })
export class ExerciseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  type!: string;

  @Column({ type: 'json' })
  data: unknown;

  @OneToMany(
    () => ExerciseParticipantEntity,
    (participant) => participant.exercise
  )
  participants!: ExerciseParticipantEntity[];

  static From(exercise: Exercise): ExerciseEntity {
    const entity = new ExerciseEntity();
    entity.id = exercise.id;
    entity.name = exercise.name;
    entity.type = exercise.type;
    entity.data = exercise.config;

    return entity;
  }

  toExercise(): Exercise {
    const exercise = ExerciseFactory.From(
      this.id,
      this.name,
      this.type as ExerciseType,
      this.data,
      this.participants.map((p) => p.toParticipant())
    );
    return exercise;
  }
}
