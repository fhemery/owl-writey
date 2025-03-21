import { EventEmitterFacade } from '@owl/back/infra/events';
import { TestUserBuilder } from '@owl/back/test-utils';
import { UserDeletedEvent } from '@owl/back/user';

import { app, exerciseUtils, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('Exercise - User:Delete event', () => {
  void moduleTestInit();

  it('should simply remove the exercises belonging to user', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );

    const eventEmitter = app.getInstance(EventEmitterFacade);
    eventEmitter.emit(new UserDeletedEvent(TestUserBuilder.Alice().uid));

    const updatedExercise = await exerciseUtils.getFromHateoas(exercise);
    expect(updatedExercise.status).toBe(404);
  });

  it('should not remove the exercises belonging to other users', async () => {
    await app.logAs(TestUserBuilder.Alice());
    const exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );

    await app.logAs(TestUserBuilder.Bob());
    await exerciseUtils.participateFromHateoas(exercise);

    const eventEmitter = app.getInstance(EventEmitterFacade);
    eventEmitter.emit(new UserDeletedEvent(TestUserBuilder.Bob().uid));

    await app.logAs(TestUserBuilder.Bob());
    const updatedExercise = await exerciseUtils.getFromHateoas(exercise);
    expect(updatedExercise.status).toBe(404); //Bob no longer has access

    await app.logAs(TestUserBuilder.Alice());
    const updatedExercise2 = await exerciseUtils.getFromHateoas(exercise);
    expect(updatedExercise2.status).toBe(200); // But ALice does
  });
});
