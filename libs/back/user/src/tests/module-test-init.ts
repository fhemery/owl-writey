import {
  IntegrationTestApplicationBuilder,
  NestTestApplication,
} from '@owl/back/test-utils';

import { UsersModule } from '../lib/users.module';

export let app: NestTestApplication;

export const moduleTestInit = (): void => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .build(UsersModule);
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
