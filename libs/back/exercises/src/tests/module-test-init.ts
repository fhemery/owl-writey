import { WsAuthService } from '@owl/back/auth';
import {
  FakeWsAuthService,
  IntegrationTestApplicationBuilder,
  NestIntegrationTestApplication,
  TestUserBuilder,
  UserTestUtils,
} from '@owl/back/test-utils';
import { FakeTrackingFacade, TrackingFacade } from '@owl/back/tracking';

import { ExercisesModule } from '../lib/exercises.module';
import { ExerciseTestUtils } from './utils/exercise-test-utils';

export let app: NestIntegrationTestApplication;
export let fakeTrackingFacade: FakeTrackingFacade;
export let exerciseUtils: ExerciseTestUtils;

export const moduleTestInit = async (port?: number): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .withPortExposition(port)
      .withMock(WsAuthService, new FakeWsAuthService())
      .withEnvVariable('BASE_API_URL', port ? `http://localhost:${port}` : '')
      .build(ExercisesModule);
    fakeTrackingFacade = app.getInstance<FakeTrackingFacade>(TrackingFacade);
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
    await fakeTrackingFacade.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
