import { WsAuthService } from '@owl/back/auth';
import {
  FakeWsAuthService,
  IntegrationTestApplicationBuilder,
  NestTestApplication,
  TestUserBuilder,
} from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { ExercisesModule } from '../lib/exercises.module';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

export let app: NestTestApplication;
export let exerciseUtils: ExerciseTestUtils;

export const moduleTestInit = async (port?: number): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .withPortExposition(port)
      .withMock(WsAuthService, new FakeWsAuthService())
      .withEnvVariable('BASE_API_URL', port ? `http://localhost:${port}` : '')
      .build(ExercisesModule);
    exerciseUtils = new ExerciseTestUtils(app);
  });

  beforeAll(async () => {
    const userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
    await userUtils.createIfNotExists(TestUserBuilder.Bob());
    await userUtils.createIfNotExists(TestUserBuilder.Carol());
  });

  afterEach(async () => {
    await app.reset();
    await exerciseUtils.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
