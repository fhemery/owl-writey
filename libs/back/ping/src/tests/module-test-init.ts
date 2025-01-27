import {
  IntegrationTestApplicationBuilder,
  NestE2eTestApplication,
  NestTestApplication,
} from '@owl/back/test-utils';

import { PingModule } from '../lib/ping.module';

export let app: NestTestApplication;

export const moduleTestInit = (): void => {
  if (process.env['E2E_TEST'] === '1') {
    app = new NestE2eTestApplication();
  } else {
    beforeAll(async () => {
      app = await new IntegrationTestApplicationBuilder().build(PingModule);
    });
  }

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
