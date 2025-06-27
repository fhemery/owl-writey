import {
  ApiResponseStatus,
  TestUserBuilder,
  waitFor,
} from '@owl/back/test-utils';
import {
  ExerciseDto,
  ExercisedUpdateEvent,
  ExquisiteCorpseExerciseDto,
  ExquisiteCorpseLinksDto,
  exquisiteCorpseTurnTakenEvent,
} from '@owl/shared/exercises/contracts';

import { ExquisiteCorpseTurnTakenTrackingEvent } from '../../lib/infra/tracking/events';
import {
  app,
  exerciseUtils,
  fakeTrackingFacade,
  moduleTestInit,
} from '../module-test-init';
import { expectNotificationReceived } from '../utils/exercise-events.utils';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('Exquisite corpse: take turn action', () => {
  const port = 3331;
  void moduleTestInit(port);

  describe('about take-turn availability', () => {
    it('should not return a take turn link if exercise is finished', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );
      await exerciseUtils.finishFromHateoas(exercise);

      const updatedExerciseResponse = await exerciseUtils.getFromHateoas(
        exercise
      );
      const links = updatedExerciseResponse.body
        ?._links as ExquisiteCorpseLinksDto;

      expect(links.takeTurn).toBeUndefined();
    });

    it('should not return a take turn link if user already has turn', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );
      await exerciseUtils.takeTurnFromHateoas(exercise);

      const updatedExerciseResponse = await exerciseUtils.getFromHateoas(
        exercise
      );
      const exerciseLinks = updatedExerciseResponse.body
        ?._links as ExquisiteCorpseLinksDto;
      expect(exerciseLinks.takeTurn).toBeUndefined();
    });

    it('should not return a take turn link if another user already has turn', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );
      await exerciseUtils.takeTurnFromHateoas(exercise);

      await app.logAs(TestUserBuilder.Bob());
      await exerciseUtils.participateFromHateoas(exercise);

      const updatedExerciseResponse = await exerciseUtils.getFromHateoas(
        exercise
      );
      const exerciseLinks = updatedExerciseResponse.body
        ?._links as ExquisiteCorpseLinksDto;
      expect(exerciseLinks.takeTurn).toBeUndefined();
    });

    it('should return a take turn link if no user has the turn', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const exerciseLinks = exercise._links as ExquisiteCorpseLinksDto;
      expect(exerciseLinks.takeTurn).toBeDefined();
      expect(exerciseLinks.takeTurn).toContain(
        `/api/exquisite-corpse/${exercise.id}/take-turn`
      );
    });
  });

  describe('POST /api/exquisite-corpse/:id/take-turn', () => {
    let exercise: ExerciseDto;

    beforeEach(async () => {
      await app.logAs(TestUserBuilder.Alice());
      exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );
    });

    describe('error cases', () => {
      it('should return 401 if user is not logged in', async () => {
        await app.logAs(null);

        const takeTurn = await exerciseUtils.takeTurn(exercise.id);

        expect(takeTurn.status).toBe(ApiResponseStatus.UNAUTHORIZED);
      });

      it('should return 400 if turn is already taken', async () => {
        await app.logAs(TestUserBuilder.Alice());
        await exerciseUtils.takeTurnFromHateoas(exercise);

        const takeTurnAgain = await exerciseUtils.takeTurnFromHateoas(exercise);
        expect(takeTurnAgain.status).toBe(ApiResponseStatus.BAD_REQUEST);
      });
    });

    describe('success cases', () => {
      it('should return 204 if user takes the turn', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const takeTurn = await exerciseUtils.takeTurnFromHateoas(exercise);

        expect(takeTurn.status).toBe(ApiResponseStatus.NO_CONTENT);
      });

      it('should tell the users that turn is taken', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const connect = await exerciseUtils.connectFromHateoas(exercise);

        await exerciseUtils.takeTurnFromHateoas(exercise);
        await waitFor(100);

        const latestUpdate = connect.getLatest(
          ExercisedUpdateEvent.eventName
        ) as ExercisedUpdateEvent;
        expect(latestUpdate).toBeDefined();

        const updatedExercise = latestUpdate.data
          .exercise as ExquisiteCorpseExerciseDto;
        expect(updatedExercise.content.currentWriter?.author.uid).toBe(
          TestUserBuilder.Alice().uid
        );
        expect(updatedExercise.content.currentWriter?.author.name).toBe(
          TestUserBuilder.Alice().name
        );
        expect(
          new Date(updatedExercise.content.currentWriter?.until || '').getTime()
        ).toBeGreaterThanOrEqual(new Date().getTime());
      });

      it('should tell the owner that turn can be canceled', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const connect = await exerciseUtils.connectFromHateoas(exercise);
        await exerciseUtils.takeTurnFromHateoas(exercise);
        await waitFor(100);

        const latestUpdate = connect.getLatest(
          ExercisedUpdateEvent.eventName
        ) as ExercisedUpdateEvent;
        expect(latestUpdate).toBeDefined();

        const updatedExercise = latestUpdate.data
          .exercise as ExquisiteCorpseExerciseDto;
        expect(updatedExercise._links.takeTurn).toBeUndefined();
        expect(updatedExercise._links.cancelTurn).toBeDefined();
        expect(updatedExercise._links.submitTurn).toBeDefined();
      });

      it('should tell another user that turn cannot be taken', async () => {
        await app.logAs(TestUserBuilder.Bob());
        await exerciseUtils.participateFromHateoas(exercise);
        const connectBob = await exerciseUtils.connectFromHateoas(exercise);

        await app.logAs(TestUserBuilder.Alice());

        await exerciseUtils.takeTurnFromHateoas(exercise);
        await waitFor(100);

        const latestUpdate = connectBob.getLatest(
          ExercisedUpdateEvent.eventName
        ) as ExercisedUpdateEvent;
        expect(latestUpdate).toBeDefined();

        const updatedExercise = latestUpdate.data
          .exercise as ExquisiteCorpseExerciseDto;
        expect(updatedExercise._links.takeTurn).toBeUndefined();
        expect(updatedExercise._links.cancelTurn).toBeUndefined();
      });

      it('should display a notification to all users saying turn is taken', async () => {
        await app.logAs(TestUserBuilder.Bob());
        await exerciseUtils.participateFromHateoas(exercise);
        const connectBob = await exerciseUtils.connectFromHateoas(exercise);

        await app.logAs(TestUserBuilder.Alice());
        const connectAlice = await exerciseUtils.connectFromHateoas(exercise);

        await exerciseUtils.takeTurnFromHateoas(exercise);
        await waitFor(100);

        const expectedData = {
          author: TestUserBuilder.Alice().name,
          exercise: exercise.name,
        };
        const expectedKey = exquisiteCorpseTurnTakenEvent;
        expectNotificationReceived(
          connectBob,
          expectedKey,
          expectedData,
          TestUserBuilder.Alice().uid
        );
        expectNotificationReceived(
          connectAlice,
          expectedKey,
          expectedData,
          TestUserBuilder.Alice().uid
        );
      });

      describe('regarding iteration duration parameter', () => {
        it('should use the iteration duration', async () => {
          await app.logAs(TestUserBuilder.Alice());
          const ex = await exerciseUtils.createAndRetrieve(
            ExerciseTestBuilder.FromExquisiteCorpse()
              .withConfigKey('iterationDuration', 600)
              .build()
          );

          const takeTurn = await exerciseUtils.takeTurnFromHateoas(ex);
          expect(takeTurn.status).toBe(ApiResponseStatus.NO_CONTENT);

          const updatedExercise = await exerciseUtils.getFromHateoas(ex);
          const updatedExerciseBody =
            updatedExercise.body as ExquisiteCorpseExerciseDto;
          const inTenMinutes = new Date();
          inTenMinutes.setMinutes(inTenMinutes.getMinutes() + 10);
          expect(
            updatedExerciseBody.content?.currentWriter?.until
          ).toBeDefined();

          expect(
            new Date(
              updatedExerciseBody.content?.currentWriter?.until || ''
            ).getTime()
          ).toBeLessThanOrEqual(inTenMinutes.getTime());
        });

        it('should use set no until if iteration duration is set to 0', async () => {
          await app.logAs(TestUserBuilder.Alice());
          const ex = await exerciseUtils.createAndRetrieve(
            ExerciseTestBuilder.FromExquisiteCorpse()
              .withConfigKey('iterationDuration', 0)
              .build()
          );

          const takeTurn = await exerciseUtils.takeTurnFromHateoas(ex);
          expect(takeTurn.status).toBe(ApiResponseStatus.NO_CONTENT);

          const updatedExercise = await exerciseUtils.getFromHateoas(ex);
          const updatedExerciseBody =
            updatedExercise.body as ExquisiteCorpseExerciseDto;
          expect(updatedExerciseBody.content?.currentWriter?.until).toBeNull();
        });
      });

      describe('about tracking events', () => {
        it('should emit a turn taken event', async () => {
          await app.logAs(TestUserBuilder.Alice());
          const exercise = await exerciseUtils.createAndRetrieve(
            ExerciseTestBuilder.ExquisiteCorpse()
          );
          await exerciseUtils.takeTurnFromHateoas(exercise);

          const event = fakeTrackingFacade.getLastByName(
            ExquisiteCorpseTurnTakenTrackingEvent.EventName
          );
          expect(event).toEqual({
            ...new ExquisiteCorpseTurnTakenTrackingEvent(
              exercise.id,
              TestUserBuilder.Alice().uid
            ),
            timestamp: expect.any(Date),
          });
        });
      });
    });
  });
});
