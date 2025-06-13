import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit, settingsUtils } from './module-test-init';

describe('Settings user scope', () => {
  void moduleTestInit();

  describe('PATCH /api/settings', () => {
    describe('when posting user settings', () => {
      describe('error cases', () => {
        it('should return 400 if scopeId is not provided', async () => {
          await app.logAs(TestUserBuilder.Alice());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'user',
            undefined
          );

          expect(response.status).toBe(400);
        });

        it('should return 401 if user is not logged', async () => {
          await app.logAs(null);

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'user',
            TestUserBuilder.Alice().uid
          );

          expect(response.status).toBe(401);
        });

        it('should return 400 if user is not the provided scope user', async () => {
          await app.logAs(TestUserBuilder.Alice());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'user',
            TestUserBuilder.Bob().uid
          );

          expect(response.status).toBe(400);
        });
      });

      describe('success cases', () => {
        it('should return 204 if user is correct', async () => {
          await app.logAs(TestUserBuilder.Alice());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'user',
            TestUserBuilder.Alice().uid
          );

          expect(response.status).toBe(204);
        });
      });
    });
  });

  describe('GET /api/settings', () => {
    describe('when getting user settings', () => {
      describe('error cases', () => {
        it('should return 400 if user is not logged', async () => {
          await app.logAs(null);

          const response = await settingsUtils.getSettings(
            'user',
            TestUserBuilder.Alice().uid
          );

          expect(response.status).toBe(400);
        });

        it('should return 400 if scopeId is not provided', async () => {
          await app.logAs(TestUserBuilder.Alice());

          const response = await settingsUtils.getSettings('user', undefined);

          expect(response.status).toBe(400);
        });
      });

      describe('success cases', () => {
        it('should return 200 if user is correct', async () => {
          await app.logAs(TestUserBuilder.Alice());
          const aliceUid = TestUserBuilder.Alice().uid;

          await settingsUtils.addSetting(
            'front.theme',
            'dark',
            'user',
            aliceUid
          );

          const response = await settingsUtils.getSettings('user', aliceUid);

          expect(response.status).toBe(200);

          const settings = response.body?.settings;
          const themeSetting = settings?.find((s) => s.key === 'front.theme');
          expect(themeSetting?.value).toBe('dark');
        });
      });
    });
  });
});
