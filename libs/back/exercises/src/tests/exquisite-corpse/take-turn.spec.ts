import {
  ApiResponseStatus,
  TestUserBuilder,
  waitFor,
} from '@owl/back/test-utils';
import {
  ExerciseDto,
  ExerciseUpdatedEvent,
  ExquisiteCorpseExerciseDto,
  ExquisiteCorpseLinksDto,
  ExquisiteCorpseTurnTakenEvent,
} from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('Exquisite corpse: take turn action', () => {
  const port = 3333;
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
          ExerciseUpdatedEvent.eventName
        ) as ExerciseUpdatedEvent;
        expect(latestUpdate).toBeDefined();

        const updatedExercise = latestUpdate.data
          .exercise as ExquisiteCorpseExerciseDto;
        expect(latestUpdate.data.notification?.key).toBe(
          ExquisiteCorpseTurnTakenEvent.translationKey
        );
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
          ExerciseUpdatedEvent.eventName
        ) as ExerciseUpdatedEvent;
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
          ExerciseUpdatedEvent.eventName
        ) as ExerciseUpdatedEvent;
        expect(latestUpdate).toBeDefined();

        const updatedExercise = latestUpdate.data
          .exercise as ExquisiteCorpseExerciseDto;
        expect(updatedExercise._links.takeTurn).toBeUndefined();
        expect(updatedExercise._links.cancelTurn).toBeUndefined();
      });
    });
  });
});
