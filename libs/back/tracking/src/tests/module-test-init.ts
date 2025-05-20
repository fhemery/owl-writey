import {
  IntegrationTestApplicationBuilder,
  NestTestApplication,
  TestUserBuilder,
} from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { TrackingFacade } from '../lib/domain';
import { PostHogTrackingModule } from '../lib/posthog-tracking.module';
import { FakeTrackingFacade } from './utils/fake-tracking.facade';

export let app: NestTestApplication;
export const fakeTrackingFacade = new FakeTrackingFacade();

export const moduleTestInit = async (): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .withMock(TrackingFacade, fakeTrackingFacade)
      .build(PostHogTrackingModule);
  });

  beforeAll(async () => {
    const userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
    await userUtils.createIfNotExists(TestUserBuilder.Bob());
    await userUtils.createIfNotExists(TestUserBuilder.Carol());
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
