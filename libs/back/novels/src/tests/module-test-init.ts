import {
  IntegrationTestApplicationBuilder,
  NestIntegrationTestApplication,
  TestUserBuilder,
} from '@owl/back/test-utils';
import { FakeTrackingFacade, TrackingFacade } from '@owl/back/tracking';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { NovelsModule } from '../lib/novels.module';
import { NovelTestUtils } from './utils/novel-test-utils';

export let app: NestIntegrationTestApplication;
export let fakeTrackingFacade: FakeTrackingFacade;
export let novelUtils: NovelTestUtils;

export const moduleTestInit = async (port?: number): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .withPortExposition(port)
      .build(NovelsModule);

    fakeTrackingFacade = app.getInstance<FakeTrackingFacade>(TrackingFacade);
    novelUtils = new NovelTestUtils(app);
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
    await novelUtils.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
