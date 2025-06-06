import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseDto, ExerciseStatus } from '@owl/shared/exercises/contracts';

import { ExerciseFinishedTrackingEvent } from '../lib/infra/tracking/events';
import {
  app,
  exerciseUtils,
  fakeTrackingFacade,
  moduleTestInit,
} from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('POST /exercises/:id/finish', () => {
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

      const response = await exerciseUtils.finish(exercise.id);
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is not admin', async () => {
      await app.logAs(TestUserBuilder.Bob());

      await exerciseUtils.participateFromHateoas(exercise);
      const getResponse = await exerciseUtils.getFromHateoas(exercise);
      expect(getResponse.body?._links.finish).toBeUndefined();

      const response = await exerciseUtils.finish(exercise.id);
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

      const removeResponse = await exerciseUtils.finishFromHateoas(exercise);
      expect(removeResponse.status).toBe(204);
    });

    it('should have the set as finished in the list', async () => {
      await app.logAs(TestUserBuilder.Alice());
      await exerciseUtils.finishFromHateoas(exercise);

      const response = await exerciseUtils.getFromHateoas(exercise);
      expect(response.status).toBe(200);
      expect(response.body?.status).toBe(ExerciseStatus.Finished);
    });

    it('should not return finish link if exercise is finished', async () => {
      await app.logAs(TestUserBuilder.Alice());
      await exerciseUtils.finishFromHateoas(exercise);

      const response = await exerciseUtils.getFromHateoas(exercise);
      expect(response.status).toBe(200);
      expect(response.body?._links.finish).toBeUndefined();
    });

    describe('tracking', () => {
      it('should track the exercise finish', async () => {
        await app.logAs(TestUserBuilder.Alice());

        await exerciseUtils.finishFromHateoas(exercise);

        const trackingEvents = await fakeTrackingFacade.getByName(
          ExerciseFinishedTrackingEvent.EventName
        );
        expect(trackingEvents).toHaveLength(1);
        expect(trackingEvents[0]).toEqual({
          ...new ExerciseFinishedTrackingEvent(
            exercise.id,
            TestUserBuilder.Alice().uid
          ),
          timestamp: expect.any(Date),
        });
      });
    });
  });
});
