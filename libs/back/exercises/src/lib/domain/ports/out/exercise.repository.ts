import {
  Exercise,
  ExerciseFilter,
  ExerciseSummary,
  QueryFilter,
} from '../../model';

export const ExerciseRepository = Symbol('ExerciseRepository');
export interface ExerciseRepository {
  save(exercise: Exercise): Promise<void>;

  getAll(userId: string, filters: QueryFilter): Promise<ExerciseSummary[]>;

  get(id: string, filters?: ExerciseFilter): Promise<Exercise | null>;

  saveContent(exercise: Exercise): Promise<void>;

  delete(exerciseId: string): Promise<void>;
}
