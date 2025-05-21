import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelDto } from '@owl/shared/novels/contracts';
import {
  NovelDescriptionChangedEvent,
  NovelTitleChangedEvent,
} from '@owl/shared/novels/model';

import { app, moduleTestInit, novelUtils } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';

describe('POST /api/novel/:id/events', () => {
  void moduleTestInit();

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

      const response = await novelUtils.sendEvent(
        existingNovel.id,
        new NovelTitleChangedEvent('new Title', TestUserBuilder.Alice().uid)
      );
      expect(response.status).toBe(401);
    });

    it('should return 404 if novel does not exist', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.sendEvent(
        'other-id',
        new NovelTitleChangedEvent('new Title', TestUserBuilder.Alice().uid)
      );
      expect(response.status).toBe(404);
    });

    it('should return 404 if novel does not belong to user', async () => {
      await app.logAs(TestUserBuilder.Bob());
      const response = await novelUtils.sendEvent(
        existingNovel.id,
        new NovelTitleChangedEvent('new Title', TestUserBuilder.Bob().uid)
      );
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 204 if novel is updated', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.sendEvent(
        existingNovel.id,
        new NovelTitleChangedEvent('new Title', TestUserBuilder.Alice().uid)
      );
      expect(response.status).toBe(204);
    });

    it('should have the updates when we get novel back', async () => {
      const newDescription = 'Updated description';
      await app.logAs(TestUserBuilder.Alice());

      const response = await novelUtils.sendEvent(
        existingNovel.id,
        new NovelDescriptionChangedEvent(
          newDescription,
          TestUserBuilder.Alice().uid
        )
      );
      expect(response.status).toBe(204);

      const getResponse = await novelUtils.get(existingNovel.id);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body?.generalInfo.description).toEqual(newDescription);
    });
  });
});
