import { Exercise } from '../../../model/exercise';
import { ExerciseFilter } from '../../../model/exercise-filter';

export const ExerciseRepository = Symbol('ExerciseRepository');
export interface ExerciseRepository {
  save(exercise: Exercise): Promise<void>;

  getAll(userId: string | null): Promise<Exercise[]>;

  get(id: string, filters?: ExerciseFilter): Promise<Exercise | null>;

  saveContent(exercise: Exercise): Promise<void>;

  delete(exerciseId: string): Promise<void>;
}
