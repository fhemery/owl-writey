import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseDto } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('POST /exercises/:id/participants', () => {
  void moduleTestInit();
  let exercise: ExerciseDto;

  beforeEach(async () => {
    await app.logAs(TestUserBuilder.Alice());
    exercise = await exerciseUtils.createAndRetrieve(
      ExerciseTestBuilder.ExquisiteCorpse()
    );
  });

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      await app.logAs(null);

      const response = await exerciseUtils.participateFromHateoas(exercise);
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is already in the list', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await exerciseUtils.participateFromHateoas(exercise);
      expect(response.status).toBe(400);
    });

    it('should return 400 if exercise is finished', async () => {
      await app.logAs(TestUserBuilder.Alice());

      await exerciseUtils.finishFromHateoas(exercise);

      await app.logAs(TestUserBuilder.Bob());
      const response = await exerciseUtils.participateFromHateoas(exercise);
      expect(response.status).toBe(400);
    });
  });

  describe('success cases', () => {
    it('should return 204 if user is added', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.participateFromHateoas(exercise);
      expect(response.status).toBe(204);
    });

    it('should have added participant to the list', async () => {
      await app.logAs(TestUserBuilder.Bob());

      await exerciseUtils.participateFromHateoas(exercise);

      const response = await exerciseUtils.getFromHateoas(exercise);
      const bob = response.body?.participants.find(
        (p) => p.uid === TestUserBuilder.Bob().uid
      );
      expect(bob).toBeDefined();
      expect(bob?.isAdmin).toBe(false);
      expect(bob?.name).toBe(TestUserBuilder.Bob().name);
    });
  });
});
