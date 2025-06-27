import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit, novelUtils } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';

describe('GET /novels', () => {
  void moduleTestInit();

  describe('error cases', () => {
    it('should return 401 if user is not logged', async () => {
      await app.logAs(null);

      const response = await novelUtils.getAll();
      expect(response.status).toBe(401);
    });
  });

  describe('success cases', () => {
    it('should return 200, [], if user owns no novel', async () => {
      await app.logAs(TestUserBuilder.Alice());

      await novelUtils.deleteAll();

      const response = await novelUtils.getAll();
      expect(response.status).toBe(200);
      expect(response.body?.data).toHaveLength(0);
    });

    it('should return the novels that belong to user if user owns some novels', async () => {
      await app.logAs(TestUserBuilder.Alice());

      await novelUtils.deleteAll();
      const createResponse = await novelUtils.create(
        NovelTestBuilder.Default()
      );
      expect(createResponse.status).toBe(201);

      const response = await novelUtils.getAll();
      expect(response.status).toBe(200);
      expect(
        response.body?.data.find((n) => n.id === createResponse.locationId)
      ).toBeDefined();
    });
  });
});
