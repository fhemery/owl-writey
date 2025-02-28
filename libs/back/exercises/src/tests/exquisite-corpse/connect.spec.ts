import { TestUserBuilder } from '@owl/back/test-utils';
import { ConnectionToExerciseSuccessfulEvent } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('GET /api/exercises/:id/connect (for an exquisite corpse)', () => {
  const port = 3564;
  void moduleTestInit(port);

  it('should return 404 if exercise does not exist', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const events = await exerciseUtils.connect('unknown-id', port);

    expect(events._error).toBeDefined();
    expect(events._error?.status).toBe(404);
  });

  it('should return 404 if exercise exists, but user is not a participant', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );

    await app.logAs(TestUserBuilder.Bob());
    const events = await exerciseUtils.connect(exercise.id, port);

    expect(events._error).toBeDefined();
    expect(events._error?.status).toBe(404);
  });

  it('should return immediately the exercise', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );

    const events = await exerciseUtils.connectFromHateoas(exercise);

    expect(
      events.getLatest(ConnectionToExerciseSuccessfulEvent.eventName)
    ).toBeDefined();
  });
});
