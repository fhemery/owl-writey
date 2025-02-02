import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelToCreateDto } from '@owl/shared/contracts';

import { UserTestUtils } from '../../../user/src/tests/utils/user-test-utils';
import { app, moduleTestInit } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';
import { NovelTestUtils } from './utils/novel-test-utils';

describe('/novels', () => {
  moduleTestInit();
  let userUtils: UserTestUtils;
  let novelUtils: NovelTestUtils;

  beforeEach(async () => {
    userUtils = new UserTestUtils(app);
    novelUtils = new NovelTestUtils(app);
    await userUtils.createIfNotExists(TestUserBuilder.Alice());
  });

  describe('POST /', () => {
    it('should return 401 if user is not logged in', async () => {
      app.logAs(null);

      const response = await novelUtils.create(NovelTestBuilder.Default());
      expect(response.status).toBe(401);
    });

    it('should return 400 if novel title is not provided', async () => {
      app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.create({
        ...NovelTestBuilder.Default(),
        title: undefined,
      } as unknown as NovelToCreateDto);
      expect(response.status).toBe(400);
    });

    it('should return 400 if novel title is empty', async () => {
      app.logAs(TestUserBuilder.Alice());
      const response = await app.post('/api/novels', {
        ...NovelTestBuilder.Default(),
        title: '',
      });
      expect(response.status).toBe(400);
    });
  });
});
