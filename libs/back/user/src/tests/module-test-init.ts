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

  // Yes, this is a before each, 'cause we are sometimes removing users ^_^
  beforeEach(async () => {
    const userUtils = new UserTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
    await userUtils.createIfNotExists(TestUserBuilder.Bob());
    await userUtils.createIfNotExists(TestUserBuilder.Carol());
  });

  beforeEach(async () => {
    await authServiceMock.addUser({
      uid: TestUserBuilder.Alice().uid,
      email: TestUserBuilder.Alice().email,
      roles: TestUserBuilder.Alice().roles,
      isEmailVerified: true,
    });
    await authServiceMock.addUser({
      uid: TestUserBuilder.Bob().uid,
      email: TestUserBuilder.Bob().email,
      roles: TestUserBuilder.Bob().roles,
      isEmailVerified: true,
    });
    await authServiceMock.addUser({
      uid: TestUserBuilder.Carol().uid,
      email: TestUserBuilder.Carol().email,
      roles: TestUserBuilder.Carol().roles,
      isEmailVerified: true,
    });
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
