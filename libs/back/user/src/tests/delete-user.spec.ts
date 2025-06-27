import { describe } from 'node:test';

import { TestUserBuilder, UserTestUtils } from '@owl/back/test-utils';

import { UserDeletedTrackingEvent } from '../lib/tracking/events';
import { app, fakeTrackingFacade, moduleTestInit } from './module-test-init';

describe('DELETE /api/users/:id', async () => {
  moduleTestInit();
  let userUtils: UserTestUtils;

  beforeEach(() => {
    userUtils = new UserTestUtils(app);
  });

  describe('Error cases', () => {
    it('should 401 if user is not logged in', async () => {
      await app.logAs(null);
      const response = await userUtils.delete(TestUserBuilder.Alice().uid);
      expect(response.status).toBe(401);
    });

    it('should return 403 if user is not the one logged in and is not admin', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await userUtils.delete(TestUserBuilder.Bob().uid);
      expect(response.status).toBe(403);
    });

    it('should return 404 if user does not exist', async () => {
      await app.logAs(TestUserBuilder.Admin());

      const response = await userUtils.delete('unknown');
      expect(response.status).toBe(404);
    });
  });

  describe('Success cases', () => {
    it('should remove the user if done by user itself', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await userUtils.delete(TestUserBuilder.Alice().uid);
      expect(response.status).toBe(204);

      const userResponse = await userUtils.getUser(TestUserBuilder.Alice().uid);
      expect(userResponse.status).toBe(404);
    });

    it('should remove the user if done by an Admin', async () => {
      await app.logAs(TestUserBuilder.Admin());

      const response = await userUtils.delete(TestUserBuilder.Alice().uid);
      expect(response.status).toBe(204);

      const userResponse = await userUtils.getUser(TestUserBuilder.Alice().uid);
      expect(userResponse.status).toBe(404);
    });

    describe('tracking', () => {
      it('should emit a UserDeletedTrackingEvent', async () => {
        await app.logAs(TestUserBuilder.Admin());

        const response = await userUtils.delete(TestUserBuilder.Alice().uid);
        expect(response.status).toBe(204);

        const event = fakeTrackingFacade.getLastByName(
          UserDeletedTrackingEvent.EventName
        );
        expect(event).toEqual({
          ...new UserDeletedTrackingEvent(TestUserBuilder.Alice().uid),
          timestamp: expect.any(Date),
        });
      });
    });
  });
});
