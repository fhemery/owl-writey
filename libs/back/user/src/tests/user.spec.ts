import { describe } from 'node:test';

import { TestUserBuilder } from '@owl/back/test-utils';
import { UserDto, UserToCreateDto } from '@owl/shared/contracts';

import { app, moduleTestInit } from './module-test-init';
import { UserTestUtils } from './utils/user-test-utils';

describe('/api/users', async () => {
  moduleTestInit();
  let userUtils: UserTestUtils;

  beforeEach(() => {
    userUtils = new UserTestUtils(app);
  });

  describe('GET /{id}', () => {
    describe('Error cases', () => {
      it('should 401 if user is not logged in', async () => {
        await app.logAs(null);
        const response = await app.get('/api/users/unknown');
        expect(response.status).toBe(401);
      });

      it('should return 404 if user does not exist', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const response = await app.get('/api/users/unknown');
        expect(response.status).toBe(404);
      });
    });

    describe('Success cases', () => {
      it('should retrieve create user', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const response = await userUtils.createUser({
          name: 'Alice',
        });

        const userResponse = await app.get<UserDto>(
          response.headers?.location || ''
        );
        expect(userResponse.status).toBe(200);
        expect(userResponse.body?.name).toBe('Alice');
        expect(userResponse.body?.email).toBeDefined();
      });

      it('should not return email if user is not the one logged in', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const response = await userUtils.createUser({
          name: 'Alice',
        });

        await app.logAs(TestUserBuilder.Bob());
        const userResponse = await app.get<UserDto>(
          response.headers?.location || ''
        );
        expect(userResponse.status).toBe(200);
        expect(userResponse.body?.email).toBeUndefined();
      });
    });
  });

  describe('POST /', () => {
    describe('error cases', () => {
      it('should return 401 if user is not logged in', async () => {
        await app.logAs(null);
        const user: UserToCreateDto = { name: 'Alice' };
        const response = await app.post<UserToCreateDto, void>(
          '/api/users',
          user
        );
        expect(response.status).toBe(401);
      });

      it('should return 400 if user is not provided', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const user: UserToCreateDto = {} as UserToCreateDto;
        const response = await app.post<UserToCreateDto, void>(
          '/api/users',
          user
        );
        expect(response.status).toBe(400);
      });

      it('should return 400 if user is empty', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const user: UserToCreateDto = { name: '' };
        const response = await app.post<UserToCreateDto, void>(
          '/api/users',
          user
        );
        expect(response.status).toBe(400);
      });
    });

    describe('success cases', () => {
      it('should create a user', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const user: UserToCreateDto = { name: 'Alice' };
        const response = await app.post<UserToCreateDto, void>(
          '/api/users',
          user
        );

        expect(response.status).toBe(201);
        expect(response.headers?.location).toContain('/api/users/alice');
      });
    });
  });
});
