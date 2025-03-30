import { ExerciseParticipantRole } from '@owl/shared/exercises/contracts';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ExerciseParticipant } from '../domain/model/exercise';
import { ExerciseEntity } from './exercise.entity';

@Entity({ name: 'exercise_participants' })
export class ExerciseParticipantEntity {
  @PrimaryColumn({ type: 'varchar', length: 36, generated: false })
  participantUid!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  role!: ExerciseParticipantRole;

  @ManyToOne(() => ExerciseEntity, (exercise) => exercise.participants)
  @JoinColumn({ name: 'exerciseId' })
  exercise!: ExerciseEntity;

  @PrimaryColumn({ name: 'exerciseId', generated: false })
  exerciseId!: string;

  toParticipant(): ExerciseParticipant {
    return new ExerciseParticipant(this.participantUid, this.name, this.role);
  }

  static From(
    participant: ExerciseParticipant,
    exercise: ExerciseEntity
  ): ExerciseParticipantEntity {
    const entity = new ExerciseParticipantEntity();
    entity.exerciseId = exercise.id;
    entity.exercise = exercise;
    entity.participantUid = participant.uid;
    entity.name = participant.name;
    entity.role = participant.role;
    return entity;
  }
}
