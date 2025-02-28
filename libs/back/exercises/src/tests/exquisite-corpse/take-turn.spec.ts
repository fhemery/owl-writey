import { TestUserBuilder } from '@owl/back/test-utils';
import { ExquisiteCorpseLinksDto } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from '../module-test-init';
import { ExerciseTestBuilder } from '../utils/exercise-test-builder';

describe('POST /api/exCorpse/:id/take-turn', () => {
  void moduleTestInit();

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

    // TODO : take turn link not displayed if user has turn already

    it('should return a take turn link if no user has the turn', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const exerciseLinks = exercise._links as ExquisiteCorpseLinksDto;
      expect(exerciseLinks.takeTurn).toBeDefined();
      expect(exerciseLinks.takeTurn).toContain(
        `/api/exCorpse/${exercise.id}/takeTurn`
      );
    });
  });
});
