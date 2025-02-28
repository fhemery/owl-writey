import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseToCreateDto } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('POST /api/exercises (exquisite corpse)', () => {
  void moduleTestInit();

  it('should throw 400 if initial text is not provided', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('initialText', null)
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(400);
  });

  it('should throw 400 if nbIterations is lower than 1', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('initialText', 'Initial text')
        .withConfigKey('nbIterations', -1)
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(400);
  });

  it('should work if no nbIterations is provided', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('initialText', 'Initial text')
        .withConfigKey('nbIterations', null)
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(201);
  });
});
