import {
  IntegrationTestApplicationBuilder,
  NestE2eTestApplication,
  NestTestApplication,
} from '@owl/back/test-utils';

import { UsersModule } from '../lib/users.module';

export let app: NestTestApplication;

export const moduleTestInit = (): void => {
  if (process.env['E2E_TEST'] === '1') {
    app = new NestE2eTestApplication();
  } else {
    beforeAll(async () => {
      app = await new IntegrationTestApplicationBuilder()
        .withFakeInMemoryDb()
        .build(UsersModule);
    });
  }

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
