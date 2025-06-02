import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseDto } from '@owl/shared/exercises/contracts';

import {
  ExerciseUserLeftTrackingEvent,
  ExerciseUserRemovedTrackingEvent,
} from '../lib/infra/tracking/events';
import {
  app,
  exerciseUtils,
  fakeTrackingFacade,
  moduleTestInit,
} from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('DELETE /exercises/:id/participants/:id', () => {
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

      const response = await exerciseUtils.removeParticipant(exercise.id, '1');
      expect(response.status).toBe(401);
    });

    it('should return 400 if user is the only admin', async () => {
      await app.logAs(TestUserBuilder.Alice());

      expect(exercise._links.leave).toBeUndefined();
      const response = await exerciseUtils.removeParticipant(
        exercise.id,
        TestUserBuilder.Alice().uid
      );
      expect(response.status).toBe(400);
    });

    it('should return 400 if user removes someone else and is not admin', async () => {
      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.participateFromHateoas(exercise);

      await app.logAs(TestUserBuilder.Carol());
      await exerciseUtils.participateFromHateoas(exercise);

      const getResponse = await exerciseUtils.getFromHateoas(exercise);
      expect(getResponse.body?._links.removeParticipant).toBeUndefined();
      const response = await exerciseUtils.removeParticipant(
        exercise.id,
        TestUserBuilder.Bob().uid
      );
      expect(response.status).toBe(400);
    });
  });

  describe('success cases', () => {
    it('should return 204 if participant removes him/herself', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.participateFromHateoas(exercise);
      expect(response.status).toBe(204);

      const getResponse = await exerciseUtils.getFromHateoas(exercise);
      expect(getResponse.body?._links.leave).toBeDefined();
      const removeResponse = await exerciseUtils.leaveFromHateoas(
        getResponse.body as ExerciseDto
      );
      expect(removeResponse.status).toBe(204);
    });

    it('should return 204 if admin removes participant', async () => {
      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.participateFromHateoas(exercise);

      await app.logAs(TestUserBuilder.Alice());
      expect(exercise._links.removeParticipant).toBeDefined();
      expect(exercise._links.removeParticipant).toContain('{id}');

      const response = await exerciseUtils.removeParticipantFromHateoas(
        exercise,
        TestUserBuilder.Bob().uid
      );
      expect(response.status).toBe(204);
    });

    it('should return 204 even if exercise is finished', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await exerciseUtils.participateFromHateoas(exercise);
      expect(response.status).toBe(204);

      await app.logAs(TestUserBuilder.Alice());
      await exerciseUtils.finishFromHateoas(exercise);

      await app.logAs(TestUserBuilder.Bob());
      const removeResponse = await exerciseUtils.removeParticipantFromHateoas(
        exercise,
        TestUserBuilder.Bob().uid
      );
      expect(removeResponse.status).toBe(204);
    });

    it('should have removed participant to the list', async () => {
      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.participateFromHateoas(exercise);

      const getResponse = await exerciseUtils.getFromHateoas(exercise);
      await exerciseUtils.leaveFromHateoas(getResponse.body as ExerciseDto);

      await app.logAs(TestUserBuilder.Alice());
      const response = await exerciseUtils.getFromHateoas(exercise);
      const bob = response.body?.participants.find(
        (p) => p.uid === TestUserBuilder.Bob().uid
      );
      expect(bob).toBeUndefined();
    });

    describe('tracking', () => {
      it('should emit exercise.user-left event if user is removing himself', async () => {
        await app.logAs(TestUserBuilder.Bob());

        await exerciseUtils.participateFromHateoas(exercise);

        const getResponse = await exerciseUtils.getFromHateoas(exercise);
        await exerciseUtils.leaveFromHateoas(getResponse.body as ExerciseDto);

        const events = fakeTrackingFacade.getByName(
          ExerciseUserLeftTrackingEvent.EventName
        );

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({
          ...new ExerciseUserLeftTrackingEvent(
            exercise.id,
            TestUserBuilder.Bob().uid
          ),
          timestamp: expect.any(Date),
        });
      });

      it('should emit exercise.user-removed event if admin is removing participant', async () => {
        await app.logAs(TestUserBuilder.Bob());
        await exerciseUtils.participateFromHateoas(exercise);

        await app.logAs(TestUserBuilder.Alice());

        const getResponse = await exerciseUtils.getFromHateoas(exercise);
        await exerciseUtils.removeParticipantFromHateoas(
          getResponse.body as ExerciseDto,
          TestUserBuilder.Bob().uid
        );

        const events = fakeTrackingFacade.getByName(
          ExerciseUserRemovedTrackingEvent.EventName
        );

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({
          ...new ExerciseUserRemovedTrackingEvent(
            exercise.id,
            TestUserBuilder.Alice().uid,
            TestUserBuilder.Bob().uid
          ),
          timestamp: expect.any(Date),
        });
      });
    });
  });
});
