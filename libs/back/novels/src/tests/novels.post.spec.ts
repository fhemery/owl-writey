import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelToCreateDto } from '@owl/shared/contracts';

import { app, moduleTestInit } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';
import { NovelTestUtils } from './utils/novel-test-utils';

describe('/api/novels', () => {
  void moduleTestInit();
  let novelUtils: NovelTestUtils;

  beforeEach(async () => {
    novelUtils = new NovelTestUtils(app);
  });

  describe('POST /', () => {
    describe('error cases', () => {
      it('should return 401 if user is not logged in', async () => {
        await app.logAs(null);

        const response = await novelUtils.create(NovelTestBuilder.Default());
        expect(response.status).toBe(401);
      });

      it('should return 400 if novel title is not provided', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const response = await novelUtils.create({
          ...NovelTestBuilder.Default(),
          title: undefined,
        } as unknown as NovelToCreateDto);
        expect(response.status).toBe(400);
      });

      it('should return 400 if novel title is empty', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const response = await app.post('/api/novels', {
          ...NovelTestBuilder.Default(),
          title: '',
        });
        expect(response.status).toBe(400);
      });
    });

    describe('success cases', () => {
      it('should return 201 if novel is created', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const response = await novelUtils.create(NovelTestBuilder.Default());
        expect(response.status).toBe(201);
      });

      it('should be able to retrieve the novel after creation', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const novel = NovelTestBuilder.Default();

        const response = await novelUtils.create(novel);

        const getResponse = await novelUtils.get(response.locationId);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body?.id).toEqual(response.locationId);
        expect(getResponse.body?.title).toEqual(novel.title);
        expect(getResponse.body?.description).toEqual(novel.description);
      });
    });
  });
});
