import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit, settingsUtils } from './module-test-init';

describe('Settings general behaviour', () => {
  void moduleTestInit();

  describe('PATCH /api/settings', () => {
    describe('general errors', () => {
      it('should return 401 if user is not logged', async () => {
        await app.logAs(null);

        const response = await settingsUtils.addSetting(
          'front.theme',
          'light',
          'anything',
          'test'
        );

        expect(response.status).toBe(401);
      });
    });
  });

  describe('GET /api/settings', () => {
    it('should assume scope is default if not provided', async () => {
      await app.logAs(TestUserBuilder.Admin());
      await settingsUtils.addSetting(
        'front.theme',
        'light',
        'default',
        undefined
      );
      await settingsUtils.addSetting(
        'front.theme',
        'dark',
        'user',
        TestUserBuilder.Admin().uid
      );

      const response = await settingsUtils.getSettings();
      expect(response.status).toBe(200);
      const settings = response.body?.settings;
      const themeSetting = settings?.find((s) => s.key === 'front.theme');
      expect(themeSetting?.value).toBe('light');
    });
  });
});
