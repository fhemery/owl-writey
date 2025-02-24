import {
  IntegrationTestApplicationBuilder,
  NestTestApplication,
} from '@owl/back/test-utils';

import { ConfigModule } from '../lib/config.module';

export let app: NestTestApplication;
export const url = 'http://whatever';

export const moduleTestInit = async (): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withEnvVariable('BASE_API_URL', url)
      .build(ConfigModule);
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
