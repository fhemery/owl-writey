import { ExerciseToCreateDto, ExerciseType } from '@owl/shared/contracts';

export class ExerciceTestBuilder {
  static ExquisiteCorpse(): ExerciseToCreateDto {
    return {
      name: 'Exquisite Corpse',
      type: ExerciseType.ExquisiteCorpse,
      data: {
        nbIterations: 5,
      },
    };
  }
}
