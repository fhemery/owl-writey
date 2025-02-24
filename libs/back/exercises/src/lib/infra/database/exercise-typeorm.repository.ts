import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseType } from '@owl/shared/contracts';
import { Repository } from 'typeorm';

import { ExerciseGeneralInfo, ExerciseSummary } from '../../domain/model';
import { Exercise } from '../../domain/model/exercise';
import { ExerciseFactory } from '../../domain/model/exercise-factory';
import { ExerciseFilter } from '../../domain/model/exercise-filter';
import { ExerciseRepository } from '../../domain/ports';
import {
  ExerciseContentEntity,
  ExerciseEntity,
  ExerciseParticipantEntity,
} from '../../entities';

@Injectable()
export class ExerciseTypeOrmRepository implements ExerciseRepository {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly repository: Repository<ExerciseEntity>,
    @InjectRepository(ExerciseParticipantEntity)
    private readonly participantRepository: Repository<ExerciseParticipantEntity>,
    @InjectRepository(ExerciseContentEntity)
    private readonly contentRepository: Repository<ExerciseContentEntity>
  ) {}

  async save(exercise: Exercise): Promise<void> {
    if (exercise.content) {
      this.saveContent(exercise);
    }

    let entity = await this.repository.findOne({
      where: { id: exercise.id },
      relations: ['participants'],
    });

    if (!entity) {
      entity = ExerciseEntity.From(exercise);
    } else {
      entity.name = exercise.generalInfo.name;
      entity.type = exercise.type;
      entity.data = exercise.config;
    }
    await this.repository.save(entity);

    await this.saveParticipants(exercise, entity);
  }

  async getAll(userId: string | null): Promise<ExerciseSummary[]> {
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

    return entities.map((entity) => entity.toExerciseSummary());
  }

  async get(
    id: string,
    filters: ExerciseFilter = {}
  ): Promise<Exercise | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['participants'],
    });
    if (!entity) {
      return null;
    }

    let content: unknown = undefined;
    if (filters.includeContent) {
      const contentEntity = await this.contentRepository.findOne({
        where: { id },
      });
      if (contentEntity) {
        content = contentEntity.content;
      }
    }

    const exercise = ExerciseFactory.From(
      entity.id,
      new ExerciseGeneralInfo(
        entity.name,
        entity.status,
        entity.participants.map((p) => p.toParticipant())
      ),
      entity.type as ExerciseType,
      entity.data,
      content
    );
    return exercise;
  }

  async saveContent(exercise: Exercise): Promise<void> {
    let entity = await this.contentRepository.findOneBy({ id: exercise.id });
    if (!entity) {
      entity = ExerciseContentEntity.From(exercise);
    } else {
      entity.content = exercise.content;
    }
    await this.contentRepository.save(entity);
  }

  async delete(exerciseId: string): Promise<void> {
    await this.contentRepository.delete({ id: exerciseId });
    await this.participantRepository.delete({ exerciseId });
    await this.repository.delete({ id: exerciseId });
  }

  private async saveParticipants(
    exercise: Exercise,
    entity: ExerciseEntity
  ): Promise<void> {
    // TODO : can we improve this to not delete ?
    await this.participantRepository.delete({ exerciseId: entity.id });
    for (const participant of exercise.getParticipants()) {
      const participantEntity = ExerciseParticipantEntity.From(
        participant,
        entity
      );
      await this.participantRepository.save(participantEntity);
    }
  }
}
