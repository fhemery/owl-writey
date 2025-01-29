import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Exercise } from '../model/exercise';
import { ExerciseParticipantEntity } from './exercice-participant.entity';

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
    entity.data = exercise.data;
    return entity;
  }
}
