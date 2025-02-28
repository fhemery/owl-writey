import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseLinksDto } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('GET /api/exercises/:id (for an exquisite corpse)', () => {
  void moduleTestInit();

  it('should work if no nbIterations is provided', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );

    const exerciseLinks = exercise._links as ExerciseLinksDto;
    expect(exerciseLinks.connect).toBe(
      '/api/exercises/' + exercise.id + '/events'
    );
  });
});
