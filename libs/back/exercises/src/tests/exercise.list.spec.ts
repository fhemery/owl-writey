import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseStatus } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('GET /exercises', () => {
  void moduleTestInit();

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      await app.logAs(null);

      const response = await exerciseUtils.list();
      expect(response.status).toBe(401);
    });
  });

  describe('success cases', () => {
    it('should return empty list if user has no exercises he participates in', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const { body } = await exerciseUtils.list();
      expect(body?.exercises).toEqual([]);
    });

    it('should return the list of exercises the user participates in', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const id = await exerciseUtils.createAndGetId(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const { body } = await exerciseUtils.list();
      const exercise = body?.exercises.find((e) => e.id === id);
      expect(exercise).toBeDefined();
      expect(exercise?.status).toBe(ExerciseStatus.Ongoing);
    });

    it('[HATEOAS] should return the url of the exercise', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const id = await exerciseUtils.createAndGetId(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const { body } = await exerciseUtils.list();
      const exercise = body?.exercises.find((e) => e.id === id);
      expect(exercise).toBeDefined();
      expect(exercise?._links.self).toBe(`/api/exercises/${id}`);
    });

    it('should not by default return finished exercises', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const finishedId = await exerciseUtils.createAndFinish(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const { body } = await exerciseUtils.list();
      const exercise = body?.exercises.find((e) => e.id === finishedId);
      expect(exercise).toBeUndefined();
    });

    it('should return finished exercises if the user asks so', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const finishedId = await exerciseUtils.createAndFinish(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const { body } = await exerciseUtils.list({ includeFinished: true });
      const exercise = body?.exercises.find((e) => e.id === finishedId);
      expect(exercise).toBeDefined();
      expect(exercise?.status).toBe(ExerciseStatus.Finished);
    });

    it('should return only the exercises the user participates in', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const id = await exerciseUtils.createAndGetId(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      await app.logAs(TestUserBuilder.Bob());

      const { body } = await exerciseUtils.list();
      expect(body?.exercises.find((e) => e.id === id)).toBeUndefined();
    });
  });
});
