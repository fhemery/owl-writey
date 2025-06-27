import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit, settingsUtils } from './module-test-init';

describe('Settings default scope', () => {
  void moduleTestInit();

  describe('PATCH /api/settings', () => {
    describe('when posting generic settings', () => {
      describe('error cases', () => {
        it('should return 400 if user is not admin', async () => {
          await app.logAs(TestUserBuilder.Alice());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'default',
            undefined
          );

          expect(response.status).toBe(400);
        });

        it('should return 400 if scopeId is provided', async () => {
          await app.logAs(TestUserBuilder.Admin());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'default',
            'scopeId'
          );

          expect(response.status).toBe(400);
        });
      });

      describe('success cases', () => {
        it('should return 204 if user is correct', async () => {
          await app.logAs(TestUserBuilder.Admin());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'default',
            undefined
          );

          expect(response.status).toBe(204);
        });
      });
    });
  });

  describe('GET /api/settings', () => {
    describe('when getting default settings', () => {
      describe('error cases', () => {
        it('should return 400 if scopeId is provided', async () => {
          await app.logAs(null);

          const response = await settingsUtils.getSettings(
            'default',
            'scopeId'
          );

          expect(response.status).toBe(400);
        });
      });

      describe('success cases', () => {
        it('should return 200 event for anonymous user', async () => {
          await app.logAs(TestUserBuilder.Admin());
          await settingsUtils.addSetting(
            'front.theme',
            'light',
            'default',
            undefined
          );

          await app.logAs(null);

          const response = await settingsUtils.getSettings(
            'default',
            undefined
          );

          expect(response.status).toBe(200);
          const setting = response.body?.settings.find(
            (s) => s.key === 'front.theme'
          );
          expect(setting).toBeDefined();
          expect(setting?.value).toBe('light');
        });
      });
    });
  });
});
