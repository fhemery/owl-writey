import {
  IntegrationTestApplicationBuilder,
  NestIntegrationTestApplication,
  TestUserBuilder,
  UserTestUtils,
} from '@owl/back/test-utils';
import { FakeTrackingFacade, TrackingFacade } from '@owl/back/tracking';

import { SettingsModule } from '../lib/settings.module';
import { SettingsUtils } from './utils/settings-test-utils';

export let app: NestIntegrationTestApplication;
export let fakeTrackingFacade: FakeTrackingFacade;
export let settingsUtils: SettingsUtils;

export const moduleTestInit = async (port?: number): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .withPortExposition(port)
      .build(SettingsModule);

    fakeTrackingFacade = app.getInstance<FakeTrackingFacade>(TrackingFacade);
    settingsUtils = new SettingsUtils(app);
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
