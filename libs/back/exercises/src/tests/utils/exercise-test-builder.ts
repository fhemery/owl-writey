import { ExerciseToCreateDto, ExerciseType } from '@owl/shared/contracts';

export class ExerciseTestBuilder {
  static ExquisiteCorpse(): ExerciseToCreateDto {
    return {
      name: 'Exquisite Corpse',
      type: ExerciseType.ExquisiteCorpse,
      config: {
        nbIterations: 5,
        initialText: 'Once upon a time...',
      },
    };
  }
}
