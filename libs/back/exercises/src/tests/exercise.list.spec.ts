import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseStatus } from '@owl/shared/contracts';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';
describe('POST /exercises', () => {
  moduleTestInit();
  let exerciseUtils: ExerciseTestUtils;
  let userUtils: UserTestUtils;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
  });

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      app.logAs(null);

      const response = await exerciseUtils.list();
      expect(response.status).toBe(401);
    });
  });

  describe('success cases', () => {
    it('should return empty list if user has no exercises he participates in', async () => {
      app.logAs(TestUserBuilder.Bob());

      const { body } = await exerciseUtils.list();
      expect(body?.exercises).toEqual([]);
    });

    it('should return the list of exercises the user participates in', async () => {
      app.logAs(TestUserBuilder.Alice());

      const id = await exerciseUtils.createAndGetId(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const { body } = await exerciseUtils.list();
      const exercise = body?.exercises.find((e) => e.id === id);
      expect(exercise).toBeDefined();
      expect(exercise?.status).toBe(ExerciseStatus.Ongoing);
    });

    it('should return only the exercises the user participates in', async () => {
      app.logAs(TestUserBuilder.Alice());
      const id = await exerciseUtils.createAndGetId(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      app.logAs(TestUserBuilder.Bob());

      const { body } = await exerciseUtils.list();
      expect(body?.exercises.find((e) => e.id === id)).toBeUndefined();
    });
  });
});
