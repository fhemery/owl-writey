import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';
import { NovelTestUtils } from './utils/novel-test-utils';

describe('DELETE /novels', () => {
  void moduleTestInit();

  let novelUtils: NovelTestUtils;

  beforeEach(() => {
    novelUtils = new NovelTestUtils(app);
  });

  describe('error cases', () => {
    it('should return 401 if user is not logged', async () => {
      await app.logAs(null);

      const response = await novelUtils.deleteAll();
      expect(response.status).toBe(401);
    });
  });

  describe('success cases', () => {
    it('should remove users novels', async () => {
      await app.logAs(TestUserBuilder.Alice());

      await novelUtils.create(NovelTestBuilder.Default());
      await novelUtils.deleteAll();

      const response = await novelUtils.getAll();
      expect(response.status).toBe(200);
      expect(response.body?.data).toHaveLength(0);
    });
  });
});
