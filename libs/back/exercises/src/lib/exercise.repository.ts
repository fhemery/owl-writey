import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseType } from '@owl/shared/contracts';
import { Repository } from 'typeorm';

import { ExerciseParticipantEntity } from './entities/exercice-participant.entity';
import { ExerciseEntity } from './entities/exercise.entity';
import { Exercise, ExerciseFactory } from './model/exercise';

@Injectable()
export class ExerciseRepository {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly repository: Repository<ExerciseEntity>,
    @InjectRepository(ExerciseParticipantEntity)
    private readonly participantRepository: Repository<ExerciseParticipantEntity>
  ) {}

  async create(exercise: Exercise): Promise<void> {
    const entity = ExerciseEntity.From(exercise);
    await this.repository.save(entity);

    for (const participant of exercise.getParticipants()) {
      const participantEntity = ExerciseParticipantEntity.From(
        participant,
        entity
      );
      await this.participantRepository.save(participantEntity);
    }
  }

  async getAll(userId: string | null): Promise<Exercise[]> {
    let entities: ExerciseEntity[];
    if (!userId) {
      entities = await this.repository.find();
    } else {
      entities = await this.repository
        .createQueryBuilder('exercise')
        .leftJoinAndSelect('exercise.participants', 'participant')
        .where('participant.participantUid = :userId', { userId })
        .getMany();
    }

    return entities.map((entity) => entity.toExercise());
  }

  async get(id: string): Promise<Exercise | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['participants'],
    });
    if (!entity) {
      return null;
    }

    const exercise = ExerciseFactory.From(
      entity.id,
      entity.name,
      entity.type as ExerciseType,
      entity.data
    );
    for (const participantEntity of entity.participants) {
      exercise.addParticipant(
        participantEntity.participantUid,
        participantEntity.name,
        participantEntity.role
      );
    }
    return exercise;
  }
}
