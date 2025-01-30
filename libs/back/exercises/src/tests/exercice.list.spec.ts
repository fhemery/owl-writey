import { TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseToCreateDto, ExerciseType } from '@owl/shared/contracts';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
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

      const response = await app.get('/api/exercises');
      expect(response.status).toBe(401);
    });
  });

  it('should return empty list if user has no exercises he participates in', async () => {
    app.logAs(TestUserBuilder.Bob());

    const response = await exerciseUtils.getAll();
    expect(response.exercises).toEqual([]);
  });

  it('should return the list of exercises the user participates in', async () => {
    app.logAs(TestUserBuilder.Alice());

    const id = await exerciseUtils.createExercise(validExerciseToCreate);

    const response = await exerciseUtils.getAll();
    expect(response.exercises.find((e) => e.id === id)).toBeDefined();
  });

  it('should return only the exercises the user participates in', async () => {
    app.logAs(TestUserBuilder.Alice());
    const id = await exerciseUtils.createExercise(validExerciseToCreate);

    app.logAs(TestUserBuilder.Bob());

    const response = await exerciseUtils.getAll();
    expect(response.exercises.find((e) => e.id === id)).toBeUndefined();
  });
});

// TODO remove duplicate
const validExerciseToCreate: ExerciseToCreateDto = {
  name: 'A valid exercise',
  type: ExerciseType.ExquisiteCorpse,
  data: {},
};
