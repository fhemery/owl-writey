import { describe } from 'node:test';

import { TestUserBuilder } from '@owl/back/test-utils';
import { Role } from '@owl/shared/contracts';

import { app, authServiceMock, moduleTestInit } from './module-test-init';
import { UserTestUtils } from './utils/user-test-utils';

describe('POST /api/users/:id/roles', async () => {
  moduleTestInit();
  let userUtils: UserTestUtils;

  beforeEach(() => {
    userUtils = new UserTestUtils(app);
  });

  describe('Error cases', () => {
    it('should 401 if user is not logged in', async () => {
      await app.logAs(null);
      const aliceUid = TestUserBuilder.Alice().uid;
      const response = await userUtils.addRole(aliceUid, Role.Beta);
      expect(response.status).toBe(401);
    });

    it('should 403 if user is not admin', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const aliceUid = TestUserBuilder.Alice().uid;
      const response = await userUtils.addRole(aliceUid, Role.Beta);
      expect(response.status).toBe(403);
    });

    it('should return 404 if user does not exist', async () => {
      await app.logAs(TestUserBuilder.Admin());

      const response = await userUtils.addRole('unknown', Role.Beta);
      expect(response.status).toBe(404);
    });
  });

  describe('Success cases', () => {
    it('should update the user role', async () => {
      await app.logAs(TestUserBuilder.Admin());

      const response = await userUtils.addRole(
        TestUserBuilder.Bob().uid,
        Role.Beta
      );
      expect(response.status).toBe(201);
      const bob = await authServiceMock.getUserByUid(TestUserBuilder.Bob().uid);

      expect(bob.roles).toContain(Role.Beta);
    });
  });
});
