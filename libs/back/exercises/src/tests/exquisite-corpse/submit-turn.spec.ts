import {
  ApiResponseStatus,
  TestUserBuilder,
  waitFor,
} from '@owl/back/test-utils';
import {
  ExerciseDto,
  ExercisedUpdateEvent,
  ExerciseStatus,
  ExquisiteCorpseExerciseDto,
  ExquisiteCorpseLinksDto,
  exquisiteCorpseTurnSubmittedEvent,
} from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { expectNotificationReceived } from '../utils/exercise-events.utils';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('Exquisite corpse: submit turn action', () => {
  const port = 3333;
  void moduleTestInit(port);

  describe('about submit-turn availability', () => {
    it("should not return a submit turn link if it is not user's turn", async () => {
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

      expect(links.submitTurn).toBeUndefined();
    });

    it('should return a submit turn link if user currently has the turn', async () => {
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
      expect(exerciseLinks.submitTurn).toBeDefined();
      expect(exerciseLinks.submitTurn).toContain(
        `/api/exquisite-corpse/${exercise.id}/submit-turn`
      );
    });
  });

  describe('POST /api/exquisite-corpse/:id/submit-turn', () => {
    let exercise: ExerciseDto;

    beforeEach(async () => {
      await app.logAs(TestUserBuilder.Alice());
      exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.FromExquisiteCorpse()
          .withConfigKey('nbIterations', 2)
          .withConfigKey('initialText', 'Some text')
          .build()
      );
    });

    describe('error cases', () => {
      it('should return 401 if user is not logged in', async () => {
        await app.logAs(null);

        const takeTurn = await exerciseUtils.submitTurn(exercise.id, '');

        expect(takeTurn.status).toBe(ApiResponseStatus.UNAUTHORIZED);
      });

      it("should return 400 if turn is not user's turn", async () => {
        await app.logAs(TestUserBuilder.Alice());

        const submitTurn = await exerciseUtils.submitTurn(
          exercise.id,
          'whatever'
        );
        expect(submitTurn.status).toBe(ApiResponseStatus.BAD_REQUEST);
      });

      it('should return 400 if text is empty', async () => {
        await app.logAs(TestUserBuilder.Alice());

        await exerciseUtils.takeTurnFromHateoas(exercise);
        const updated = await exerciseUtils.getFromHateoas(exercise);

        if (!updated.body) {
          fail('Exercise not defined');
        }

        const submitTurn = await exerciseUtils.submitTurnFromHateoas(
          updated.body,
          ''
        );
        expect(submitTurn.status).toBe(ApiResponseStatus.BAD_REQUEST);
      });
    });

    describe('success cases', () => {
      it('should return 204 if user successfully submits turn', async () => {
        await app.logAs(TestUserBuilder.Alice());
        await exerciseUtils.takeTurnFromHateoas(exercise);
        const submitTurn = await exerciseUtils.submitTurn(
          exercise.id,
          'some text'
        );

        expect(submitTurn.status).toBe(ApiResponseStatus.NO_CONTENT);
      });

      it('should add the content to the scenes', async () => {
        await app.logAs(TestUserBuilder.Alice());
        await exerciseUtils.takeTurnFromHateoas(exercise);
        const newSceneText = 'some text';
        await exerciseUtils.submitTurn(exercise.id, newSceneText);

        const updatedExerciseResponse = await exerciseUtils.getFromHateoas(
          exercise
        );

        const exquisiteCorpse =
          updatedExerciseResponse.body as ExquisiteCorpseExerciseDto;
        expect(exquisiteCorpse.content.currentWriter).toBeUndefined();
        expect(exquisiteCorpse.content.scenes).toHaveLength(2);
        const lastScene = exquisiteCorpse.content.scenes[1];
        expect(lastScene.text).toBe(newSceneText);
        expect(lastScene.author.uid).toBe(TestUserBuilder.Alice().uid);
        expect(lastScene.author.name).toBe(TestUserBuilder.Alice().name);
      });

      it('should set the exercise as finished if user makes the last contribution', async () => {
        await app.logAs(TestUserBuilder.Alice());
        await exerciseUtils.takeTurnFromHateoas(exercise);
        const newSceneText = 'some text';
        await exerciseUtils.submitTurn(exercise.id, newSceneText);
        await exerciseUtils.takeTurnFromHateoas(exercise);
        await exerciseUtils.submitTurn(exercise.id, newSceneText);

        const updatedExerciseResponse = await exerciseUtils.getFromHateoas(
          exercise
        );

        const exquisiteCorpse =
          updatedExerciseResponse.body as ExquisiteCorpseExerciseDto;
        expect(exquisiteCorpse.status).toBe(ExerciseStatus.Finished);
        expect(exquisiteCorpse._links.takeTurn).toBeUndefined();
        expect(exquisiteCorpse._links.cancelTurn).toBeUndefined();
        expect(exquisiteCorpse._links.submitTurn).toBeUndefined();
      });

      it('should notify all users that turn has been submitted', async () => {
        await app.logAs(TestUserBuilder.Bob());
        await exerciseUtils.participateFromHateoas(exercise);
        const connectBob = await exerciseUtils.connectFromHateoas(exercise);

        await app.logAs(TestUserBuilder.Alice());

        const connectAlice = await exerciseUtils.connectFromHateoas(exercise);

        await exerciseUtils.takeTurnFromHateoas(exercise);
        await exerciseUtils.submitTurn(exercise.id, 'Some text');
        await waitFor(100);

        const key = exquisiteCorpseTurnSubmittedEvent;
        const data = {
          exercise: exercise.name,
          author: TestUserBuilder.Alice().name,
        };
        expectNotificationReceived(
          connectAlice,
          key,
          data,
          TestUserBuilder.Alice().uid
        );
        expectNotificationReceived(
          connectBob,
          key,
          data,
          TestUserBuilder.Alice().uid
        );
      });

      it('should tell the users that turn is submitted', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const connect = await exerciseUtils.connectFromHateoas(exercise);

        await exerciseUtils.takeTurnFromHateoas(exercise);
        await exerciseUtils.submitTurn(exercise.id, 'Some text');
        await waitFor(100);

        const latestUpdate = connect.getLatest(
          ExercisedUpdateEvent.eventName
        ) as ExercisedUpdateEvent;
        expect(latestUpdate).toBeDefined();

        const updatedExercise = latestUpdate.data
          .exercise as ExquisiteCorpseExerciseDto;
        expect(updatedExercise.content.currentWriter).toBeUndefined();
        expect(updatedExercise.content.scenes).toHaveLength(2);

        expect(updatedExercise._links.takeTurn).toBeDefined();
        expect(updatedExercise._links.submitTurn).toBeUndefined();
        expect(updatedExercise._links.cancelTurn).toBeUndefined();
      });
    });
  });
});
