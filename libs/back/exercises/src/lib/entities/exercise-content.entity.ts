import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Exercise } from '../domain/model/exercise';

@Entity({ name: 'exercise_content' })
export class ExerciseContentEntity {
  @PrimaryColumn({ type: 'varchar' })
  id!: string;

  @Column({ type: 'json', nullable: false })
  content!: unknown;

  static From(exercise: Exercise): ExerciseContentEntity {
    const entity = new ExerciseContentEntity();
    entity.id = exercise.id;
    entity.content = exercise.content;
    return entity;
  }
}
