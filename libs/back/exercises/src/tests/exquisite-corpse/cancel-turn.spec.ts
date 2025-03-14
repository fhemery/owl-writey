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
} from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('POST /api/exCorpse/:id/cancel-turn', () => {
  const port = 3332;
  void moduleTestInit(port);

  describe('about take-turn availability', () => {
    it("should not return a cancel turn link if it is not user's turn", async () => {
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

      const links = updatedExerciseResponse.body
        ?._links as ExquisiteCorpseLinksDto;

      expect(links.cancelTurn).toBeUndefined();
    });

    it('should return a cancel turn link if user currently has the turn', async () => {
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
      expect(exerciseLinks.cancelTurn).toBeDefined();
      expect(exerciseLinks.cancelTurn).toContain(
        `/api/exquisite-corpse/${exercise.id}/cancel-turn`
      );
    });
  });

  describe('POST /api/exquisite-corpse/:id/cancel-turn', () => {
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

        const takeTurn = await exerciseUtils.cancelTurn(exercise.id);

        expect(takeTurn.status).toBe(ApiResponseStatus.UNAUTHORIZED);
      });

      it("should return 400 if it is not user's turn", async () => {
        await app.logAs(TestUserBuilder.Alice());
        await exerciseUtils.takeTurnFromHateoas(exercise);
        const updatedExerciseResponse = await exerciseUtils.getFromHateoas(
          exercise
        );
        if (!updatedExerciseResponse.body) {
          fail('No exercise found');
        }

        await app.logAs(TestUserBuilder.Bob());
        await exerciseUtils.participateFromHateoas(exercise);

        const cancelTurnResponse = await exerciseUtils.cancelTurnFromHateoas(
          updatedExerciseResponse.body
        );
        expect(cancelTurnResponse.status).toBe(ApiResponseStatus.BAD_REQUEST);
      });
    });

    describe('success cases', () => {
      it('should return 204 if user has turn', async () => {
        await app.logAs(TestUserBuilder.Alice());

        await exerciseUtils.takeTurnFromHateoas(exercise);

        const updated = await exerciseUtils.getFromHateoas(exercise);
        if (!updated.body) {
          fail('No exercise found');
        }
        const cancelTurn = await exerciseUtils.cancelTurnFromHateoas(
          updated.body
        );

        expect(cancelTurn.status).toBe(ApiResponseStatus.NO_CONTENT);
      });

      it('should tell the users that turn is canceled', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const connect = await exerciseUtils.connectFromHateoas(exercise);

        await exerciseUtils.takeTurnFromHateoas(exercise);
        await exerciseUtils.cancelTurn(exercise.id);
        await waitFor(100);

        const latestUpdate = connect.getLatest(
          ExerciseUpdatedEvent.eventName
        ) as ExerciseUpdatedEvent;
        expect(latestUpdate).toBeDefined();

        const updatedExercise = latestUpdate.data
          .exercise as ExquisiteCorpseExerciseDto;
        expect(updatedExercise.content.currentWriter).toBeUndefined();
        expect(updatedExercise._links.takeTurn).toBeDefined();
        expect(updatedExercise._links.cancelTurn).toBeUndefined();
        expect(updatedExercise._links.submitTurn).toBeUndefined();
      });
    });
  });
});
