import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelDto } from '@owl/shared/novels/contracts';

import { NovelDeletedTrackingEvent } from '../lib/infra/tracking/events/novel-deleted-tracking-event';
import {
  app,
  fakeTrackingFacade,
  moduleTestInit,
  novelUtils,
} from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';

describe('DELETE /novels/:id', () => {
  void moduleTestInit();

  let existingNovel: NovelDto;
  beforeEach(async () => {
    await app.logAs(TestUserBuilder.Alice());
    existingNovel = await novelUtils.createAndRetrieve(
      NovelTestBuilder.Default()
    );
  });

  describe('error cases', () => {
    it('should return 401 if user is not logged', async () => {
      await app.logAs(null);

      const response = await novelUtils.deleteOne(existingNovel.id);
      expect(response.status).toBe(401);
    });

    it('should return 404 if novel does not exist', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await novelUtils.deleteOne('unknownId');
      expect(response.status).toBe(404);
    });

    it('should return 404 if user is not author', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await novelUtils.deleteOne(existingNovel.id);
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 204 and remove novel', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const deleteResponse = await novelUtils.deleteOne(existingNovel.id);
      expect(deleteResponse.status).toBe(204);

      const response = await novelUtils.get(existingNovel.id);
      expect(response.status).toBe(404);
    });

    it('should remove novel from the list of novels', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await novelUtils.deleteOne(existingNovel.id);
      expect(response.status).toBe(204);

      const getAllResponse = await novelUtils.getAll();
      expect(getAllResponse.status).toBe(200);
      expect(
        getAllResponse.body?.data.find((n) => n.id === existingNovel.id)
      ).toBeUndefined();
    });

    describe('tracking', () => {
      it('should track novel deletion', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const deleteResponse = await novelUtils.deleteOne(existingNovel.id);
        expect(deleteResponse.status).toBe(204);

        const event = fakeTrackingFacade.getByName('novel.deleted');
        expect(event).toHaveLength(1);

        expect(event[0]).toEqual({
          ...new NovelDeletedTrackingEvent(existingNovel.id, TestUserBuilder.Alice().uid),
          timestamp: expect.any(Date),
        });
      });
    });
  });
});
