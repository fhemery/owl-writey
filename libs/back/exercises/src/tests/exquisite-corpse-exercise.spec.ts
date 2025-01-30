import { TestUserBuilder, wsUtils } from '@owl/back/test-utils';
import {
  ExquisiteCorpseContentDto,
  exquisiteCorpseEvents,
} from '@owl/shared/contracts';
import { UserTestUtils } from 'libs/back/user/src/tests/utils/user-test-utils';

import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('Exquisite Corpse Exercise', () => {
  const port = 3456;
  moduleTestInit(port);

  let exerciseUtils: ExerciseTestUtils;
  let userUtils: UserTestUtils;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
  });

  describe('Exquisite corpse', () => {
    it('should return the content via socket', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);
      const id = await exerciseUtils.createExercise(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const aliceSocket = wsUtils.connect(alice.uid, port);
      aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
      const data = await wsUtils.waitFor<ExquisiteCorpseContentDto>(
        aliceSocket,
        exquisiteCorpseEvents.updates
      );
      expect(data.scenes).toHaveLength(1);
      expect(data.scenes[0].author.id).toBe(TestUserBuilder.Alice().uid);
      expect(data.scenes[0].author.name).toBe(TestUserBuilder.Alice().name);
      aliceSocket.disconnect();
    });

    it('should be able to take turn if no one currently has it', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);
      const id = await exerciseUtils.createExercise(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const aliceSocket = wsUtils.connect(alice.uid, port);
      aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });
      const data = await wsUtils.waitFor<ExquisiteCorpseContentDto>(
        aliceSocket,
        exquisiteCorpseEvents.updates
      );

      console.log('Received', JSON.stringify(data));
      expect(data.currentWriter?.author.id).toBe(alice.uid);

      // TODO FIX
      // TODO Check it is saved
      // TODO Send to room instead of user
    });
  });
});
