import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelDto, NovelSseEvent } from '@owl/shared/novels/contracts';
import { NovelDescriptionChangedEvent } from '@owl/shared/novels/model';

import { app, moduleTestInit, novelUtils } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';

const port = 3339;
describe('GET /api/novel/:id/events', () => {
  void moduleTestInit(port);
  let existingNovel: NovelDto;

  beforeEach(async () => {
    await app.logAs(TestUserBuilder.Alice());
    existingNovel = await novelUtils.createAndRetrieve(
      NovelTestBuilder.Default()
    );
  });

  describe('error cases', () => {
    it('should return 401 if user is not logged in', async () => {
      await app.logAs(null);

      const connection = await novelUtils.getEvents(existingNovel.id, port);
      expect(connection._error?.status).toBe(401);
    });

    it('should return 404 if novel does not exist', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.getEvents('other-id', port);
      expect(response._error?.status).toBe(404);
    });

    it('should return 404 if novel does not belong to user', async () => {
      await app.logAs(TestUserBuilder.Bob());
      const response = await novelUtils.getEvents(existingNovel.id, port);
      expect(response._error?.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return no error if novel belongs to user', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.getEvents(existingNovel.id, port);
      expect(response._error).toBeUndefined();
    });

    it('should get the existing updates', async () => {
      const newDescription = 'Updated description';
      await app.logAs(TestUserBuilder.Alice());

      const sendResponse = await novelUtils.sendEvent(
        existingNovel.id,
        new NovelDescriptionChangedEvent(newDescription)
      );
      expect(sendResponse.status).toBe(204);

      const connection = await novelUtils.getEvents(existingNovel.id, port);
      const initialUpdate = connection.getLatest(
        NovelSseEvent.eventName
      ) as NovelSseEvent;
      expect(initialUpdate).toBeDefined();
      expect(initialUpdate.data).toHaveLength(1);
    });
  });
});
