import { TestUserBuilder } from '@owl/back/test-utils';

import { app, exerciseUtils, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('DELETE /exercises', () => {
  void moduleTestInit();

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      await app.logAs(null);

      const response = await exerciseUtils.deleteAll();
      expect(response.status).toBe(401);
    });
  });

  describe('success cases', () => {
    it('should return 204 whether it deleted exercises or not', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const removeResponse = await exerciseUtils.deleteAll();
      expect(removeResponse.status).toBe(204);
    });

    it('should have removed exercise belonging to user', async () => {
      await app.logAs(TestUserBuilder.Alice());
      await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      await exerciseUtils.deleteAll();

      const all = await exerciseUtils.list();
      expect(all.body?.exercises.length).toBe(0);
    });

    it('should not have removed exercise not belonging to user, but removed user participation', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const aliceExercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.participateFromHateoas(aliceExercise);
      await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      await exerciseUtils.deleteAll();

      const all = await exerciseUtils.list();
      expect(all.body?.exercises.length).toBe(0);
    });
  });
});
