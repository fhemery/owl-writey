import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelDto } from '@owl/shared/novels/contracts';

import { app, moduleTestInit, novelUtils } from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';

describe('Novel settings', () => {
  void moduleTestInit();
  let existingNovel: NovelDto;

  beforeEach(async () => {
    await app.logAs(TestUserBuilder.Alice());
    existingNovel = await novelUtils.createAndRetrieve(
      NovelTestBuilder.Default()
    );
  });

  describe('Adding settings', () => {
    it('should return 400 if user does not own novel', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await novelUtils.addSettings(
        existingNovel.id,
        'novel.settingName',
        'novel.settingValue'
      );
      expect(response.status).toBe(400);
    });

    it('should return 204 if user does own novel', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await novelUtils.addSettings(
        existingNovel.id,
        'novel.settingName',
        'novel.settingValue'
      );
      expect(response.status).toBe(204);
    });
  });

  describe('Getting settings', () => {
    it('should return 400 if user does not participate to novel', async () => {
      await app.logAs(TestUserBuilder.Bob());

      const response = await novelUtils.getSettings(existingNovel.id);
      expect(response.status).toBe(400);
    });

    it('should return 200 if user does own novel', async () => {
      await app.logAs(TestUserBuilder.Alice());

      await novelUtils.addSettings(
        existingNovel.id,
        'novel.settingName',
        'novel.settingValue'
      );

      const getResponse = await novelUtils.getSettings(existingNovel.id);
      expect(getResponse.status).toBe(200);

      const setting = getResponse.body?.settings.find(
        (s) => s.key === 'novel.settingName'
      );
      expect(setting).toBeDefined();
      expect(setting?.value).toBe('novel.settingValue');
    });
  });
});
