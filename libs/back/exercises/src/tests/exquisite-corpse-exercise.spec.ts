import { TestUserBuilder } from '@owl/back/test-utils';
import {
  ExquisiteCorpseContentDto,
  exquisiteCorpseEvents,
} from '@owl/shared/contracts';
import { UserTestUtils } from 'libs/back/user/src/tests/utils/user-test-utils';
import { io, Socket } from 'socket.io-client';

import { app, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

describe('Exquisite Corpse Exercise', () => {
  const port = 3456;
  moduleTestInit(port);

  let exerciseUtils: ExerciseTestUtils;
  let userUtils: UserTestUtils;
  let ioClient: Socket;

  beforeEach(async () => {
    exerciseUtils = new ExerciseTestUtils(app);
    userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());

    ioClient = io('http://localhost:3456', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      auth: { token: TestUserBuilder.Alice().uid },
    });
  });

  describe('Exquisite corpse', () => {
    it('should return the content via socket', async () => {
      const alice = TestUserBuilder.Alice();
      app.logAs(alice);
      const id = await exerciseUtils.createExercise(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      ioClient.connect();
      ioClient.emit(exquisiteCorpseEvents.connect, { id });
      await new Promise<void>((resolve) => {
        ioClient.on(
          exquisiteCorpseEvents.updates,
          (data: ExquisiteCorpseContentDto) => {
            expect(data.scenes).toHaveLength(1);
            expect(data.scenes[0].author.id).toBe(TestUserBuilder.Alice().uid);
            expect(data.scenes[0].author.name).toBe(
              TestUserBuilder.Alice().name
            );
            resolve();
          }
        );
      });
      ioClient.disconnect();
    });
  });
});
