import { TestUserBuilder } from '@owl/back/test-utils';
import {
  ExerciseToCreateDto,
  ExquisiteCorpseExerciseDto,
} from '@owl/shared/contracts';

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

  it('should throw 400 if iteration duration is not valid', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('initialText', 'Initial text')
        .withConfigKey('iterationDuration', -1)
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(400);

    const otherExercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('initialText', 'Initial text')
        .withConfigKey('iterationDuration', 'invalid')
        .build();

    const otherResponse = await exerciseUtils.create(otherExercise);
    expect(otherResponse.status).toBe(400);
  });

  it.each<{ minWords?: number; maxWords?: number; description: string }>([
    { minWords: 0, maxWords: 21, description: 'invalid minWords: 0' },
    { minWords: -1, maxWords: 10, description: 'invalid minWords: -1' },
    { minWords: undefined, maxWords: 0, description: 'invalid maxWords: 0' },
    {
      minWords: 10,
      maxWords: 5,
      description: 'invalid maxWords: lower than minWords',
    },
  ])(
    'should throw 400 if textSize is not valid, $description',
    async ({ minWords, maxWords }) => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise: ExerciseToCreateDto =
        ExerciseTestBuilder.FromExquisiteCorpse()
          .withConfigKey('textSize', { minWords, maxWords })
          .build();

      const response = await exerciseUtils.create(exercise);
      expect(response.status).toBe(400);
    }
  );

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

  it('should work if iteration duration is not provided, and default it to 900 seconds (15 minutes)', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('initialText', 'Initial text')
        .withConfigKey('nbIterations', 0)
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(201);

    const createdExercise = await exerciseUtils.getOne(
      response.locationId || ''
    );
    const retrievedExercise =
      createdExercise.body as ExquisiteCorpseExerciseDto;
    expect(retrievedExercise.config?.iterationDuration).toBe(900);
  });

  it('should work if iteration duration is provided', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('iterationDuration', 600)
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(201);

    const createdExercise = await exerciseUtils.getOne(
      response.locationId || ''
    );
    const retrievedExercise =
      createdExercise.body as ExquisiteCorpseExerciseDto;
    expect(retrievedExercise.config?.iterationDuration).toBe(600);
  });

  it('should work if iteration duration is set to 0', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('iterationDuration', 0)
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(201);

    const createdExercise = await exerciseUtils.getOne(
      response.locationId || ''
    );
    const retrievedExercise =
      createdExercise.body as ExquisiteCorpseExerciseDto;
    expect(retrievedExercise.config?.iterationDuration).toBe(0);
  });

  it('should work with textSize correctly set', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise: ExerciseToCreateDto =
      ExerciseTestBuilder.FromExquisiteCorpse()
        .withConfigKey('iterationDuration', 0)
        .withConfigKey('textSize', { minWords: 10, maxWords: 20 })
        .build();

    const response = await exerciseUtils.create(exercise);
    expect(response.status).toBe(201);

    const createdExercise = await exerciseUtils.getOne(
      response.locationId || ''
    );
    const retrievedExercise =
      createdExercise.body as ExquisiteCorpseExerciseDto;
    expect(retrievedExercise.config?.textSize?.minWords).toBe(10);
    expect(retrievedExercise.config?.textSize?.maxWords).toBe(20);
  });
});
