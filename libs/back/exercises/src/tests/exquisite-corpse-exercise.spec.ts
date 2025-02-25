import {
  SseUtils,
  TestUserBuilder,
  waitFor,
  WsUtils,
} from '@owl/back/test-utils';
import {
  ConnectToExerciseEvent,
  ExerciseStatus,
  ExerciseToCreateDto,
  ExquisiteCorpseContentDto,
  exquisiteCorpseEvents,
} from '@owl/shared/contracts';
import { UserTestUtils } from 'libs/back/user/src/tests/utils/user-test-utils';

import { ExquisiteCorpseConfig } from '../lib/domain/model';
import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('Exquisite Corpse Exercise', () => {
  const port = 3456;
  void moduleTestInit(port);

  let exerciseUtils: ExerciseTestUtils;
  let userUtils: UserTestUtils;
  let wsUtils: WsUtils;
  let sseUtils: SseUtils;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    wsUtils = new WsUtils();
    sseUtils = new SseUtils();
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
    await userUtils.createIfNotExists(TestUserBuilder.Bob());
  });

  afterEach(() => {
    wsUtils.disconnectAll();
    sseUtils.disconnectAll();
  });

  describe('Exquisite corpse', () => {
    describe('POST /api/exercises', () => {
      it('should throw 400 if initial text is not provided', async () => {
        const exercise: ExerciseToCreateDto =
          ExerciseTestBuilder.FromExquisiteCorpse()
            .withConfigKey('initialText', null)
            .build();

        const response = await exerciseUtils.create(exercise);
        expect(response.status).toBe(400);
      });

      it('should throw 400 if nbIterations is lower than 1', async () => {
        const exercise: ExerciseToCreateDto =
          ExerciseTestBuilder.FromExquisiteCorpse()
            .withConfigKey('initialText', 'Initial text')
            .withConfigKey('nbIterations', -1)
            .build();

        const response = await exerciseUtils.create(exercise);
        expect(response.status).toBe(400);
      });

      it('should work if no nbIterations is provided', async () => {
        const exercise: ExerciseToCreateDto =
          ExerciseTestBuilder.FromExquisiteCorpse()
            .withConfigKey('initialText', 'Initial text')
            .withConfigKey('nbIterations', null)
            .build();

        const response = await exerciseUtils.create(exercise);
        expect(response.status).toBe(201);
      });
    });

    describe(exquisiteCorpseEvents.connect, () => {
      it('should return the content via socket', async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
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

      it('should notify the other users when someone connects', async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
        const exercise = ExerciseTestBuilder.ExquisiteCorpse();
        const id = await exerciseUtils.createAndGetId(exercise);

        const events = await sseUtils.connect(
          `http://localhost:3456/api/users/${alice.uid}/events`
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        const bobSocket = wsUtils.connectWs(TestUserBuilder.Bob().uid, port);

        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await bobSocket.emit(exquisiteCorpseEvents.connect, { id });

        await waitFor(10);

        const event = events.getLatest<ConnectToExerciseEvent>(
          ConnectToExerciseEvent.eventName
        );
        expect(event).toBeDefined();
        expect(event.data.exerciseName).toBe(exercise.name);
        expect(event.data.author).toBe(TestUserBuilder.Bob().name);
      });
    });

    describe(exquisiteCorpseEvents.takeTurn, () => {
      it('should be able to take turn if no one currently has it', async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
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
        await app.logAs(alice);
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

      it('should not give turn if exercise is finished', async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
        const id = await exerciseUtils.createAndFinish(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, { id });

        // ASSERT
        const data = aliceSocket.getLatest<ExquisiteCorpseContentDto>(
          exquisiteCorpseEvents.updates
        );

        expect(data.currentWriter).toBeUndefined();
      });

      it('should forward updates to the room, not only the current user', async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
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
        await app.logAs(alice);
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

      it("should not be able to submit turn if it is someone else's turn", async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
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

      it('should not be able to submit turn if exercise is finished', async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(
          ExerciseTestBuilder.ExquisiteCorpse()
        );

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, {
          id,
        });
        await exerciseUtils.finish(id);
        await aliceSocket.emit(exquisiteCorpseEvents.submitTurn, {
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
        await app.logAs(alice);
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

      it('should finish the exercise when nb iterations is reached', async () => {
        const alice = TestUserBuilder.Alice();
        const exercise = ExerciseTestBuilder.ExquisiteCorpse();
        exercise.config = new ExquisiteCorpseConfig('initial', 1);
        await app.logAs(alice);
        const id = await exerciseUtils.createAndGetId(exercise);

        const aliceSocket = wsUtils.connectWs(alice.uid, port);
        await aliceSocket.emit(exquisiteCorpseEvents.connect, { id });
        await aliceSocket.emit(exquisiteCorpseEvents.takeTurn, {
          id,
        });
        await aliceSocket.emit(exquisiteCorpseEvents.submitTurn, {
          id,
          content: 'Content',
        });

        const getResponse = await exerciseUtils.getOne(id);
        expect(getResponse.body?.status).toBe(ExerciseStatus.Finished);
      });
    });

    describe(exquisiteCorpseEvents.cancelTurn, () => {
      it("should not be able to cancel turn if it is not user's turn", async () => {
        const alice = TestUserBuilder.Alice();
        await app.logAs(alice);
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
        await app.logAs(alice);
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
