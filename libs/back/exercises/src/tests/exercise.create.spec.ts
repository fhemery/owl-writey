import { TestUserBuilder } from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('POST /exercises', () => {
  moduleTestInit();
  let exerciseUtils: ExerciseTestUtils;
  let userUtils: UserTestUtils;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
  });

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      app.logAs(null);

      const response = await app.post('/api/exercises', {});
      expect(response.status).toBe(401);
    });

    it('should return 400 if name is empty or too short', async () => {
      app.logAs(TestUserBuilder.Alice());

      const response = await app.post('/api/exercises', {
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        name: undefined,
      });
      expect(response.status).toBe(400);

      const otherResponse = await app.post('/api/exercises', {
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        name: 'ab',
      });
      expect(otherResponse.status).toBe(400);
    });

    it('should return 400 if type is not valid', async () => {
      app.logAs(TestUserBuilder.Alice());

      const response = await app.post('/api/exercises', {
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        type: 'Not a valid type',
      });
      expect(response.status).toBe(400);
    });
  });

  describe('success cases', () => {
    it('should return 201 and id if the exercise is created', async () => {
      app.logAs(TestUserBuilder.Alice());

      const response = await app.post(
        '/api/exercises',
        ExerciseTestBuilder.ExquisiteCorpse()
      );
      expect(response.status).toBe(201);
      expect(response.responseHeaders?.location).toContain('/api/exercises/');
    });

    it('should be able to retrieve the created exercise', async () => {
      app.logAs(TestUserBuilder.Alice());

      const response = await app.post(
        '/api/exercises',
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      expect(response.responseHeaders?.location).toBeDefined();
      const getResponse = await app.get(
        response.responseHeaders?.location ?? ''
      );

      expect(getResponse.status).toBe(200);
    });

    it('should set currentUser in the participants', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);

      const id = await exerciseUtils.createExercise(
        ExerciseTestBuilder.ExquisiteCorpse()
      );
      const exercise = await exerciseUtils.get(id);

      expect(exercise.participants).toHaveLength(1);
      expect(exercise.participants[0].uid).toBe(alice.uid);
      expect(exercise.participants[0].name).toBe(alice.name);
      expect(exercise.participants[0].isAdmin).toBe(true);
    });
  });
});
