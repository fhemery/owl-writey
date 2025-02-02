import {
  IntegrationTestApplicationBuilder,
  NestTestApplication,
} from '@owl/back/test-utils';

import { NovelsModule } from '../lib/novels.module';

export let app: NestTestApplication;

export const moduleTestInit = async (): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .build(NovelsModule);
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
