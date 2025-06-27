import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseDto } from '@owl/shared/exercises/contracts';

import { ExerciseDeletedTrackingEvent } from '../lib/infra/tracking/events';
import {
  app,
  exerciseUtils,
  fakeTrackingFacade,
  moduleTestInit,
} from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('DELETE /exercises/:id', () => {
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

      const response = await exerciseUtils.delete(exercise.id);
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is not admin', async () => {
      await app.logAs(TestUserBuilder.Bob());

      await exerciseUtils.participateFromHateoas(exercise);
      const getResponse = await exerciseUtils.getFromHateoas(exercise);
      expect(getResponse.body?._links.delete).toBeUndefined();

      const response = await exerciseUtils.delete(exercise.id);
      expect(response.status).toBe(400);
    });

    it('should return 404 if exercise does not exist', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.delete('unknownId');
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 204 if user is admin', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const removeResponse = await exerciseUtils.deleteFromHateoas(exercise);
      expect(removeResponse.status).toBe(204);
    });

    it('should have removed exercise', async () => {
      await app.logAs(TestUserBuilder.Alice());

      await exerciseUtils.deleteFromHateoas(exercise);

      const response = await exerciseUtils.getFromHateoas(exercise);
      expect(response.status).toBe(404);
    });

    describe('tracking', () => {
      it('should track the exercise delete', async () => {
        await app.logAs(TestUserBuilder.Alice());

        await exerciseUtils.deleteFromHateoas(exercise);

        const trackingEvents = await fakeTrackingFacade.getByName(
          ExerciseDeletedTrackingEvent.EventName
        );
        expect(trackingEvents).toHaveLength(1);
        expect(trackingEvents[0]).toEqual({
          ...new ExerciseDeletedTrackingEvent(
            exercise.id,
            TestUserBuilder.Alice().uid
          ),
          timestamp: expect.any(Date),
        });
      });
    });
  });
});
