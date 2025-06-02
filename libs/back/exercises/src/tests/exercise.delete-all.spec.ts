import { TestUserBuilder } from '@owl/back/test-utils';

import {
  ExerciseDeletedTrackingEvent,
  ExerciseUserLeftTrackingEvent,
} from '../lib/infra/tracking/events';
import {
  app,
  exerciseUtils,
  fakeTrackingFacade,
  moduleTestInit,
} from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('DELETE /exercises', () => {
  void moduleTestInit();

  beforeAll(async () => {
    await app.logAs(TestUserBuilder.Alice());
    await exerciseUtils.deleteAll();
  });

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

    describe('tracking', () => {
      it('should track the exercise delete', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const aliceExercise = await exerciseUtils.createAndRetrieve(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        await exerciseUtils.deleteAll();

        const aliceExerciseTracking = await fakeTrackingFacade.getLastByName(
          ExerciseDeletedTrackingEvent.EventName
        );
        expect(aliceExerciseTracking).toEqual({
          ...new ExerciseDeletedTrackingEvent(
            aliceExercise.id,
            TestUserBuilder.Alice().uid
          ),
          timestamp: expect.any(Date),
        });
      });

      it('should track the exercise participation removal', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const aliceExercise = await exerciseUtils.createAndRetrieve(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        await app.logAs(TestUserBuilder.Bob());
        await exerciseUtils.participateFromHateoas(aliceExercise);

        await exerciseUtils.deleteAll();

        const aliceExerciseTracking = await fakeTrackingFacade.getByName(
          ExerciseUserLeftTrackingEvent.EventName
        );
        expect(aliceExerciseTracking).toHaveLength(1);
        expect(aliceExerciseTracking[0]).toEqual({
          ...new ExerciseUserLeftTrackingEvent(
            aliceExercise.id,
            TestUserBuilder.Bob().uid
          ),
          timestamp: expect.any(Date),
        });
      });
    });
  });
});
