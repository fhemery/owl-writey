import { TestUserBuilder, WsUtils } from '@owl/back/test-utils';
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
  let wsUtils: WsUtils;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    wsUtils = new WsUtils();
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
  });

  afterEach(() => {
    wsUtils.disconnectAll();
  });

  describe('Exquisite corpse', () => {
    it('should return the content via socket', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);
      const id = await exerciseUtils.createExercise(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const aliceSocket = wsUtils.connectWs(alice.uid, port);
      await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
      const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
        exquisiteCorpseEvents.updates
      );
      expect(data.scenes).toHaveLength(1);
      expect(data.scenes[0].author.id).toBe(TestUserBuilder.Alice().uid);
      expect(data.scenes[0].author.name).toBe(TestUserBuilder.Alice().name);
    });

    it('should be able to take turn if no one currently has it', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);
      const id = await exerciseUtils.createExercise(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const aliceSocket = wsUtils.connectWs(alice.uid, port);
      await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
      await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });
      const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
        exquisiteCorpseEvents.updates
      );

      expect(data.currentWriter?.author.id).toBe(alice.uid);
      expect(data.currentWriter?.author.name).toBe(alice.name);
    });

    it('should forward updates to the room, not only the current user', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);
      const id = await exerciseUtils.createExercise(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      const aliceSocket = wsUtils.connectWs(alice.uid, port);
      const bobSocket = wsUtils.connectWs(TestUserBuilder.Bob().uid, port);
      await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
      await bobSocket.emit(exquisiteCorpseEvents.connect, { id });
      await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });

      const event = bobSocket.getLatest<ExquisiteCorpseContentDto>(
        exquisiteCorpseEvents.updates
      );
      expect(event.currentWriter?.author.id).toBe(alice.uid);
    });
  });
});
