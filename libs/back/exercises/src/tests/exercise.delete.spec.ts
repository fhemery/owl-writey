import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseDto } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from './module-test-init';
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

      await app.post(exercise._links.invite || '', {});
      const getResponse = await app.get<ExerciseDto>(exercise._links.self);
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

      if (!exercise._links.delete) {
        fail('Delete link not found');
      }
      const removeResponse = await app.delete(exercise._links.delete);
      expect(removeResponse.status).toBe(204);
    });

    it('should have removed exercise', async () => {
      await app.logAs(TestUserBuilder.Alice());
      if (!exercise._links.delete) {
        fail('Delete link not found');
      }
      await app.delete(exercise._links.delete);

      const response = await app.get(exercise._links.self);
      expect(response.status).toBe(404);
    });
  });
});
