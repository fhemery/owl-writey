import { AuthService } from '@owl/back/auth';
import {
  IntegrationTestApplicationBuilder,
  NestTestApplication,
  TestUserBuilder,
} from '@owl/back/test-utils';

import { UsersModule } from '../lib/users.module';
import { AuthServiceMock } from './auth-service.mock';
import { UserTestUtils } from './utils/user-test-utils';

export let app: NestTestApplication;
export const authServiceMock: AuthServiceMock = new AuthServiceMock();

export const moduleTestInit = (): void => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .withMock(AuthService, authServiceMock)
      .build(UsersModule);
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
