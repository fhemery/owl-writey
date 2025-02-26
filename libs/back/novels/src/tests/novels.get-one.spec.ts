import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';
import { NovelTestUtils } from './utils/novel-test-utils';

describe('GET /novels/:id', () => {
  void moduleTestInit();

  let novelUtils: NovelTestUtils;

  beforeEach(() => {
    novelUtils = new NovelTestUtils(app);
  });

  describe('error cases', () => {
    it('should return 401 if user is not logged', async () => {
      await app.logAs(null);

      const response = await novelUtils.get('1');
      expect(response.status).toBe(401);
    });

    it('should return 404 if novel does not exist', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await novelUtils.get('unknownId');
      expect(response.status).toBe(404);
    });

    it('should return 404 if user is not the owner of the novel', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const response = await novelUtils.create(NovelTestBuilder.Default());

      await app.logAs(TestUserBuilder.Bob());
      const getResponse = await novelUtils.get(response.locationId);
      expect(getResponse.status).toBe(404);
    });
  });
});
