import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelDto } from '@owl/shared/contracts';

import { app, moduleTestInit } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';
import { NovelTestUtils } from './utils/novel-test-utils';

describe('PUT /api/novels/:id', () => {
  void moduleTestInit();
  let novelUtils: NovelTestUtils;

  let existingNovel: NovelDto;

  beforeEach(async () => {
    novelUtils = new NovelTestUtils(app);

    await app.logAs(TestUserBuilder.Alice());
    existingNovel = await novelUtils.createAndRetrieve(
      NovelTestBuilder.Default()
    );
  });

  describe('error cases', () => {
    it('should return 401 if user is not logged in', async () => {
      await app.logAs(null);

      const response = await novelUtils.update(existingNovel);
      expect(response.status).toBe(401);
    });

    it('should return 400 if id is not identical to the one of the novel', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.update(existingNovel, 'other-id');
      expect(response.status).toBe(400);
    });

    it('should not update the participants', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.update({
        ...existingNovel,
        participants: [],
      });
      expect(response.status).toBe(204);

      const getResponse = await novelUtils.get(existingNovel.id);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body?.participants).toHaveLength(1);
    });

    it('should return 400 if novel is not valid', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.update({
        ...existingNovel,
        title: '',
      });
      expect(response.status).toBe(400);
    });

    it('should return 404 if novel does not exist', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.update({
        ...existingNovel,
        id: 'non-existent-id',
      });
      expect(response.status).toBe(404);
    });

    it('should return 404 if novel does not belong to user', async () => {
      await app.logAs(TestUserBuilder.Bob());
      const response = await novelUtils.update(existingNovel);
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 204 if novel is updated', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.update({
        ...existingNovel,
        description: 'Updated description',
      });
      expect(response.status).toBe(204);
    });

    it('should have the updates when we get novel back', async () => {
      const newDescription = 'Updated description';
      await app.logAs(TestUserBuilder.Alice());

      const response = await novelUtils.update({
        ...existingNovel,
        description: newDescription,
      });
      expect(response.status).toBe(204);

      const getResponse = await novelUtils.get(existingNovel.id);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body?.description).toEqual(newDescription);
    });
  });
});
