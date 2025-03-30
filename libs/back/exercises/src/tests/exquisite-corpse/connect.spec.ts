import { TestUserBuilder, waitFor } from '@owl/back/test-utils';
import {
  connectedToExerciseEvent,
  disconnectedFromExerciseEvent,
  ExercisedUpdateEvent,
} from '@owl/shared/exercises/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { expectNotificationReceived } from '../utils/exercise-events.utils';
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

    const event = events.getLatest(ExercisedUpdateEvent.eventName);
    expect(event).toBeDefined();

    const detailedEvent = event as ExercisedUpdateEvent;
    expect(detailedEvent.data.exercise.id).toEqual(exercise.id);
  });

  it('should notify all users when a user connects', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );
    const aliceEvents = await exerciseUtils.connectFromHateoas(exercise);

    await app.logAs(TestUserBuilder.Bob());
    await exerciseUtils.participateFromHateoas(exercise);
    const bobEvents = await exerciseUtils.connectFromHateoas(exercise);

    const expectedKey = connectedToExerciseEvent;
    const expectedData = {
      exercise: exercise.name,
      author: TestUserBuilder.Bob().name,
    };
    expectNotificationReceived(
      bobEvents,
      expectedKey,
      expectedData,
      TestUserBuilder.Bob().uid
    );
    expectNotificationReceived(
      aliceEvents,
      expectedKey,
      expectedData,
      TestUserBuilder.Bob().uid
    );
  });

  it('should notify other when a user leaves', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );
    const aliceEvents = await exerciseUtils.connectFromHateoas(exercise);

    await app.logAs(TestUserBuilder.Bob());
    await exerciseUtils.participateFromHateoas(exercise);
    const bobEvents = await exerciseUtils.connectFromHateoas(exercise);

    bobEvents.close();
    await waitFor(100);

    const expectedKey = disconnectedFromExerciseEvent;
    const expectedData = {
      exercise: exercise.name,
      author: TestUserBuilder.Bob().name,
    };
    expectNotificationReceived(
      aliceEvents,
      expectedKey,
      expectedData,
      TestUserBuilder.Bob().uid
    );
  });
});
