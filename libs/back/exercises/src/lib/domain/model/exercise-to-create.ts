import { ExerciseType } from '@owl/shared/contracts';

export class ExerciseToCreate {
  constructor(
    readonly name: string,
    readonly type: ExerciseType,
    readonly config: unknown,
    readonly content?: unknown
  ) {}
}
