import { ExerciseUser } from '../../model';

export const ExerciseUserFacade = Symbol('ExerciseUserFacade');
export interface ExerciseUserFacade {
  get(userId: string): Promise<ExerciseUser | null>;
}
