import { TestUserBuilder } from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('DELETE /exercises/:id/participants/:id', () => {
  void moduleTestInit();
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
    exerciseId = await exerciseUtils.createAndGetId(
      ExerciseTestBuilder.ExquisiteCorpse()
    );
  });

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      await app.logAs(null);

      const response = await exerciseUtils.removeParticipant(exerciseId, '1');
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is the only admin', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await exerciseUtils.removeParticipant(
        exerciseId,
        TestUserBuilder.Alice().uid
      );
      expect(response.status).toBe(400);
    });

    it('should return 400 if user removes someone else and is not admin', async () => {
      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.addParticipant(exerciseId);

      await app.logAs(TestUserBuilder.Carol());
      await exerciseUtils.addParticipant(exerciseId);
      const response = await exerciseUtils.removeParticipant(
        exerciseId,
        TestUserBuilder.Bob().uid
      );
      expect(response.status).toBe(400);
    });
  });

  describe('success cases', () => {
    it('should return 204 if participant removes him/herself', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.addParticipant(exerciseId);
      expect(response.status).toBe(204);

      const removeResponse = await exerciseUtils.removeParticipant(
        exerciseId,
        TestUserBuilder.Bob().uid
      );
      expect(removeResponse.status).toBe(204);
    });

    it('should return 204 if admin removes participant', async () => {
      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.addParticipant(exerciseId);

      await app.logAs(TestUserBuilder.Alice());
      const response = await exerciseUtils.removeParticipant(
        exerciseId,
        TestUserBuilder.Bob().uid
      );
      expect(response.status).toBe(204);
    });

    it('should return 204 even if exercise is finished', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.addParticipant(exerciseId);
      expect(response.status).toBe(204);

      await app.logAs(TestUserBuilder.Alice());
      await exerciseUtils.finish(exerciseId);

      await app.logAs(TestUserBuilder.Bob());
      const removeResponse = await exerciseUtils.removeParticipant(
        exerciseId,
        TestUserBuilder.Bob().uid
      );
      expect(removeResponse.status).toBe(204);
    });

    it('should have removed participant to the list', async () => {
      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.addParticipant(exerciseId);
      await exerciseUtils.removeParticipant(
        exerciseId,
        TestUserBuilder.Bob().uid
      );

      await app.logAs(TestUserBuilder.Alice());
      const response = await exerciseUtils.get(exerciseId);
      const bob = response.participants.find(
        (p) => p.uid === TestUserBuilder.Bob().uid
      );
      expect(bob).toBeUndefined();
    });
  });
});
