import {
  ExerciseToCreateDto,
  ExerciseType,
} from '@owl/shared/exercises/contracts';

export class ExerciseTestBuilder {
  private name = 'Exercise';
  private type: ExerciseType = ExerciseType.ExquisiteCorpse;
  private config: Record<string, unknown> = {};

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

  static FromExquisiteCorpse(): ExerciseTestBuilder {
    return new ExerciseTestBuilder()
      .withType(ExerciseType.ExquisiteCorpse)
      .withConfigKey('initialText', 'Some text');
  }

  withType(type: ExerciseType): ExerciseTestBuilder {
    this.type = type;
    return this;
  }

  withConfigKey(key: string, value: unknown): ExerciseTestBuilder {
    this.config[key] = value;
    return this;
  }

  build(): ExerciseToCreateDto {
    return { name: this.name, type: this.type, config: this.config };
  }
}
