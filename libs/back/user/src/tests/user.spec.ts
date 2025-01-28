import { FakeAuthMiddleware } from '@owl/back/test-utils';

import { app, moduleTestInit } from './module-test-init';

describe('/api/users', () => {
  moduleTestInit();

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
  });
});
