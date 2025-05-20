import {
  IntegrationTestApplicationBuilder,
  NestIntegrationTestApplication,
  TestUserBuilder,
} from '@owl/back/test-utils';
import { FakeTrackingFacade, TrackingFacade } from '@owl/back/tracking';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { NovelsModule } from '../lib/novels.module';

export let app: NestIntegrationTestApplication;
export let fakeTrackingFacade: FakeTrackingFacade;

export const moduleTestInit = async (): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .build(NovelsModule);

    fakeTrackingFacade = app.getInstance<FakeTrackingFacade>(TrackingFacade);
  });

  beforeAll(async () => {
    const userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
    await userUtils.createIfNotExists(TestUserBuilder.Bob());
    await userUtils.createIfNotExists(TestUserBuilder.Carol());
  });

  afterEach(async () => {
    await app.reset();
    await fakeTrackingFacade.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
