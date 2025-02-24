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
    describe(exquisiteCorpseEvents.connect, () => {
      it('should return the content via socket', async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );
        expect(data.scenes).toHaveLength(1);
        expect(data.scenes[0].author.uid).toBe(TestUserBuilder.Alice().uid);
        expect(data.scenes[0].author.name).toBe(TestUserBuilder.Alice().name);
      });
    });

    describe(exquisiteCorpseEvents.takeTurn, () => {
      it('should be able to take turn if no one currently has it', async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });
        const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );

        expect(data.currentWriter?.author.uid).toBe(alice.uid);
        expect(data.currentWriter?.author.name).toBe(alice.name);
      });

      it('should not give turn if another user has already taken it', async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        const bobSocket = wsUtils.connectWs(TestUserBuilder.Bob().uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await bobSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });

        // ACT
        await bobSocket.emit(exquisiteCorpseEvents.takeTurn, { id });

        // ASSERT
        const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );

        expect(data.currentWriter?.author.uid).toBe(alice.uid);
        expect(data.currentWriter?.author.name).toBe(alice.name);
      });

      it('should forward updates to the room, not only the current user', async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
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
        expect(event.currentWriter?.author.uid).toBe(alice.uid);
      });
    });

    describe(exquisiteCorpseEvents.submitTurn, () => {
      it("should be able to submit turn if it is no one's turn", async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.submitTurn, {
          id,
          content: 'new content',
        });

        const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );
        expect(data.scenes).toHaveLength(1);
      });

      it("should be able to submit turn if it is someone else's turn", async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        const bobSocket = wsUtils.connectWs(TestUserBuilder.Bob().uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, {
          id,
        });
        await bobSocket.emit(exquisiteCorpseEvents.submitTurn, {
          id,
          content: 'Content',
        });

        const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );
        expect(data.scenes).toHaveLength(1);
      });

      it('should be able to work with correct user submitting', async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        const bobSocket = wsUtils.connectWs(TestUserBuilder.Bob().uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await bobSocket.emit(exquisiteCorpseEvents.connect, { id });

        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, {
          id,
        });
        await aliceSocket.emit(exquisiteCorpseEvents.submitTurn, {
          id,
          content: 'Content',
        });

        const data = bobSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );
        expect(data.scenes).toHaveLength(2);
        expect(data.scenes[1].text).toBe('Content');
        expect(data.scenes[1].author.uid).toBe(alice.uid);
        expect(data.scenes[1].author.name).toBe(alice.name);
      });
    });

    describe(exquisiteCorpseEvents.cancelTurn, () => {
      it("should not be able to cancel turn if it is not user's turn", async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        const bobSocket = wsUtils.connectWs(TestUserBuilder.Bob().uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await bobSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });
        await bobSocket.emit(exquisiteCorpseEvents.cancelTurn, { id });

        const event = bobSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );
        expect(event.currentWriter?.author.uid).toBe(alice.uid);
      });
      it('should be able to cancel turn if it is your turn', async () => {
        const alice = TestUserBuilder.Alice();
        app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        const bobSocket = wsUtils.connectWs(TestUserBuilder.Bob().uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await bobSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.cancelTurn, { id });

        const event = bobSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );
        expect(event.currentWriter).toBe(undefined);
      });
    });
  });
});
