import { ExerciseStatus, ExerciseType } from '@owl/shared/exercises/contracts';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { ExerciseGeneralInfo, ExerciseSummary } from '../domain/model';
import { Exercise } from '../domain/model/exercise';
import { ExerciseFactory } from '../domain/model/exercise-factory';
import { ExerciseParticipantEntity } from './exercise-participant.entity';

@Entity({ name: 'exercises' })
export class ExerciseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({
    type: 'varchar',
    length: 12,
    transformer: {
      to: (value: ExerciseStatus) => value,
      from: (value: string) => value as ExerciseStatus,
    },
  })
  status!: ExerciseStatus;

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
    entity.name = exercise.generalInfo.name;
    entity.status = exercise.generalInfo.status;
    entity.type = exercise.type;
    entity.data = exercise.config;

    return entity;
  }

  toExercise(): Exercise {
    const exercise = ExerciseFactory.From(
      this.id,
      new ExerciseGeneralInfo(
        this.name,
        this.status,
        this.participants.map((p) => p.toParticipant())
      ),
      this.type as ExerciseType,
      this.data
    );
    return exercise;
  }

  toExerciseSummary(): ExerciseSummary {
    return new ExerciseSummary(
      this.id,
      this.name,
      this.type as ExerciseType,
      this.status
    );
  }
}
