import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseStatus } from '@owl/shared/contracts';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('POST /exercises/:id/finish', () => {
  void moduleTestInit();
  let exerciseUtils: ExerciseTestUtils;
  let userUtils: UserTestUtils;

  let exerciseId: string;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
    await userUtils.createIfNotExists(TestUserBuilder.Bob());

    await app.logAs(TestUserBuilder.Alice());
    exerciseId = await exerciseUtils.createAndGetId(
      ExerciseTestBuilder.ExquisiteCorpse()
    );
  });

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      await app.logAs(null);

      const response = await exerciseUtils.finish(exerciseId);
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is not admin', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.finish(exerciseId);
      expect(response.status).toBe(400);
    });

    it('should return 404 if exercise does not exist', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.finish('unknownId');
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 204 if user is admin', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const removeResponse = await exerciseUtils.finish(exerciseId);
      expect(removeResponse.status).toBe(204);
    });

    it('should have the set as finished in the list', async () => {
      await app.logAs(TestUserBuilder.Alice());
      await exerciseUtils.finish(exerciseId);

      const response = await exerciseUtils.getOne(exerciseId);
      expect(response.status).toBe(200);
      expect(response.body?.status).toBe(ExerciseStatus.Finished);
    });
  });
});
