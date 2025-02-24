import { TestUserBuilder } from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('POST /exercises/:id/participants', () => {
  moduleTestInit();
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
      app.logAs(null);

      const response = await app.post(
        `/api/exercises/${exerciseId}/participants`,
        {}
      );
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is already in the list', async () => {
      app.logAs(TestUserBuilder.Alice());

      const response = await app.post(
        `/api/exercises/${exerciseId}/participants`,
        {}
      );
      expect(response.status).toBe(400);
    });

    it('should return 400 if exercise is finished', async () => {
      app.logAs(TestUserBuilder.Alice());

      await exerciseUtils.finish(exerciseId);

      app.logAs(TestUserBuilder.Bob());
      const response = await exerciseUtils.addParticipant(exerciseId);
      expect(response.status).toBe(400);
    });
  });

  describe('success cases', () => {
    it('should return 204 if user is added', async () => {
      app.logAs(TestUserBuilder.Bob());

      const response = await app.post(
        `/api/exercises/${exerciseId}/participants`,
        {}
      );
      expect(response.status).toBe(204);
    });
    it('should have added participant to the list', async () => {
      app.logAs(TestUserBuilder.Bob());

      await app.post(`/api/exercises/${exerciseId}/participants`, {});

      const response = await exerciseUtils.get(exerciseId);
      const bob = response.participants.find(
        (p) => p.uid === TestUserBuilder.Bob().uid
      );
      expect(bob).toBeDefined();
      expect(bob?.isAdmin).toBe(false);
      expect(bob?.name).toBe(TestUserBuilder.Bob().name);
    });
  });
});
