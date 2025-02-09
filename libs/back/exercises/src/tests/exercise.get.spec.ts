import { TestUserBuilder } from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('GET /exercises/:id', () => {
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

      const response = await exerciseUtils.getOne('1');
      expect(response.status).toBe(401);
    });

    it('should return 400 if type is not valid', async () => {
      app.logAs(TestUserBuilder.Alice());

      const response = await app.post('/api/exercises', {
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        type: 'Not a valid type',
      });
      expect(response.status).toBe(400);
    });

    it('should return 404 if user does not participate to exercise', async () => {
      app.logAs(TestUserBuilder.Alice());

      const { locationId } = await exerciseUtils.create(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      app.logAs(TestUserBuilder.Bob());
      const response = await exerciseUtils.getOne(locationId ?? '');
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 200 if exercise belongs to user', async () => {
      app.logAs(TestUserBuilder.Alice());
      const exercise = ExerciseTestBuilder.ExquisiteCorpse();

      const { locationId } = await exerciseUtils.create(exercise);

      const { status, body } = await exerciseUtils.getOne(locationId ?? '');
      expect(status).toBe(200);
      expect(body?.name).toBe(exercise.name);
      expect(body?.id).toBe(locationId);
    });

    it('should set currentUser in the participants', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);

      const id = await exerciseUtils.createAndGetId(
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
