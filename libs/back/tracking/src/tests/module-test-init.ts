import {
  IntegrationTestApplicationBuilder,
  NestIntegrationTestApplication,
  TestUserBuilder,
} from '@owl/back/test-utils';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { TrackingFacade } from '../lib/domain';
import { FakeTrackingFacade } from '../lib/infra/tracking-facades/fake-tracker/fake-tracking.facade';
import { TrackingModule } from '../lib/tracking.module';

export let app: NestIntegrationTestApplication;
export let fakeTrackingFacade: FakeTrackingFacade;

export const moduleTestInit = async (): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .build(TrackingModule);

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
