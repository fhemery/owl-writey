import { describe } from 'node:test';

import { FakeAuthMiddleware } from '@owl/back/test-utils';
import { UserDto, UserToCreateDto } from '@owl/shared/contracts';

import { app, moduleTestInit } from './module-test-init';
import { UserTestUtils } from './utils/user-test-utils';

describe('/api/users', () => {
  moduleTestInit();
  let userUtils: UserTestUtils;

  beforeEach(() => {
    userUtils = new UserTestUtils(app);
  });

  describe('GET /{id}', () => {
    describe('Error cases', () => {
      it('should 401 if user is not logged in', async () => {
        FakeAuthMiddleware.SetUser(null);
        const response = await app.get('/api/users/unknown');
        expect(response.status).toBe(401);
      });

      it('should return 404 if user does not exist', async () => {
        FakeAuthMiddleware.SetUser('alice');
        const response = await app.get('/api/users/unknown');
        expect(response.status).toBe(404);
      });
    });

    describe('Success cases', () => {
      it('should retrieve create user', async () => {
        FakeAuthMiddleware.SetUser('alice');
        const response = await userUtils.createUser({
          name: 'Alice',
        });

        const userResponse = await app.get<UserDto>(
          response.responseHeaders?.location || ''
        );
        expect(userResponse.status).toBe(200);
        expect(userResponse.body?.name).toBe('Alice');
      });
    });
  });

  describe('POST /', () => {
    describe('error cases', () => {
      it('should return 401 if user is not logged in', async () => {
        FakeAuthMiddleware.SetUser(null);
        const user: UserToCreateDto = { name: 'Alice' };
        const response = await app.post<UserToCreateDto, void>(
          '/api/users',
          user
        );
        expect(response.status).toBe(401);
      });
    });

    describe('success cases', () => {
      it('should create a user', async () => {
        FakeAuthMiddleware.SetUser('alice');
        const user: UserToCreateDto = { name: 'Alice' };
        const response = await app.post<UserToCreateDto, void>(
          '/api/users',
          user
        );

        expect(response.status).toBe(201);
        expect(response.responseHeaders?.location).toContain(
          '/api/users/alice'
        );
      });
    });
  });
});
