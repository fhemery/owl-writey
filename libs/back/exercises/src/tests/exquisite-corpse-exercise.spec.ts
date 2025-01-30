import { TestUserBuilder } from '@owl/back/test-utils';
import { ExquisiteCorpseContentDto } from '@owl/shared/contracts';
import { UserTestUtils } from 'libs/back/user/src/tests/utils/user-test-utils';
import { io, Socket } from 'socket.io-client';

import { app, moduleTestInit } from './module-test-init';
import { ExerciceTestBuilder } from './utils/exercice-factory';
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
    });
  });

  describe('Exquisite corpse', () => {
    it('should return the content via socket', async () => {
      app.logAs(TestUserBuilder.Alice());
      const id = await exerciseUtils.createExercise(
        ExerciceTestBuilder.ExquisiteCorpse()
      );

      ioClient.connect();
      ioClient.emit('exCorpse:connect', { id });
      await new Promise<void>((resolve) => {
        ioClient.on('exCorpse:updates', (data: ExquisiteCorpseContentDto) => {
          expect(data.scenes).toHaveLength(1);
          resolve();
        });
      });
      ioClient.disconnect();
    });
  });
});
