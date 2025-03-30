import { ExerciseStatus, ExerciseType } from '@owl/shared/exercises/contracts';

export class ExerciseSummary {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: ExerciseType,
    public readonly status: ExerciseStatus
  ) {}
}
