import { TestUserBuilder } from '@owl/back/test-utils';
import {
  ExerciseDto,
  ExerciseToCreateDto,
} from '@owl/shared/exercises/contracts';

import { app, exerciseUtils, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('POST /exercises', () => {
  void moduleTestInit();

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      await app.logAs(null);

      const response = await exerciseUtils.create({} as ExerciseToCreateDto);
      expect(response.status).toBe(401);
    });

    it('should return 400 if name is empty or too short', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await exerciseUtils.create({
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        name: undefined,
      } as unknown as ExerciseToCreateDto);
      expect(response.status).toBe(400);

      const otherResponse = await exerciseUtils.create({
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        name: 'ab',
      });
      expect(otherResponse.status).toBe(400);
    });

    it('should return 400 if type is not valid', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await exerciseUtils.create({
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        type: 'Not a valid type',
      } as unknown as ExerciseToCreateDto);
      expect(response.status).toBe(400);
    });
  });

  describe('success cases', () => {
    it('should return 201 and id if the exercise is created', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await exerciseUtils.create(
        ExerciseTestBuilder.ExquisiteCorpse()
      );
      expect(response.status).toBe(201);
      expect(response.headers?.location).toContain('/api/exercises/');
    });

    it('should be able to retrieve the created exercise', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await exerciseUtils.create(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      expect(response.headers?.location).toBeDefined();
      const getResponse = await app.get<ExerciseDto>(
        response.headers?.location ?? ''
      );

      expect(getResponse.status).toBe(200);
      expect(getResponse.body?._links.self).toBe(response.headers?.location);
    });
  });
});
