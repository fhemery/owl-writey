import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit, novelUtils } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';

describe('DELETE /novels', () => {
  void moduleTestInit();

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
