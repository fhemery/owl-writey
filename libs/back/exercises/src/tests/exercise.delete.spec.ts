import { TestUserBuilder } from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('DELETE /exercises/:id', () => {
  moduleTestInit();
  let exerciseUtils: ExerciseTestUtils;
  let userUtils: UserTestUtils;

  let exerciseId: string;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
    await userUtils.createIfNotExists(TestUserBuilder.Bob());
    await userUtils.createIfNotExists(TestUserBuilder.Carol());

    await app.logAs(TestUserBuilder.Alice());
    exerciseId = await exerciseUtils.createExercise(
      ExerciseTestBuilder.ExquisiteCorpse()
    );
  });

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      app.logAs(null);

      const response = await exerciseUtils.removeParticipant(exerciseId, '1');
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is not admin', async () => {
      app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.delete(exerciseId);
      expect(response.status).toBe(400);
    });

    // TODO Check 404 on other tests
    it('should return 404 if exercise does not exist', async () => {
      app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.delete('unknownId');
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 204 if user is admin', async () => {
      app.logAs(TestUserBuilder.Alice());

      const removeResponse = await exerciseUtils.delete(exerciseId);
      expect(removeResponse.status).toBe(204);
    });

    it('should have removed exercise', async () => {
      app.logAs(TestUserBuilder.Alice());
      await exerciseUtils.delete(exerciseId);

      const response = await exerciseUtils.getOne(exerciseId);
      expect(response.status).toBe(404);
    });
  });
});
