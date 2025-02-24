import { ExerciseStatus, ExerciseType } from '@owl/shared/contracts';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { ExerciseGeneralInfo, ExerciseSummary } from '../domain/model';
import { Exercise } from '../domain/model/exercise';
import { ExerciseFactory } from '../domain/model/exercise-factory';
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
    entity.name = exercise.generalInfo.name;
    entity.type = exercise.type;
    entity.data = exercise.config;

    return entity;
  }

  toExercise(): Exercise {
    const exercise = ExerciseFactory.From(
      this.id,
      new ExerciseGeneralInfo(
        this.name,
        ExerciseStatus.Ongoing, // TODO: Store and retrieve this !
        this.participants.map((p) => p.toParticipant())
      ),
      this.type as ExerciseType,
      this.data
    );
    return exercise;
  }

  toExerciseSummary(): ExerciseSummary {
    return new ExerciseSummary(this.id, this.name, this.type as ExerciseType);
  }
}
