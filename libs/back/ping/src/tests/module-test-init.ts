import {
  IntegrationTestApplicationBuilder,
  NestTestApplication,
} from '@owl/back/test-utils';

import { PingModule } from '../lib/ping.module';

export let app: NestTestApplication;

export const moduleTestInit = async (): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder().build(PingModule);
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
