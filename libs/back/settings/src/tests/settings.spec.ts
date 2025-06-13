import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit, settingsUtils } from './module-test-init';

describe('Settings', () => {
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

        it('should return 403 if user is not the provided scope user', async () => {
          await app.logAs(TestUserBuilder.Alice());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'user',
            TestUserBuilder.Bob().uid
          );

          expect(response.status).toBe(403);
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

    describe('when posting generic settings', () => {
      describe('error cases', () => {
        it('should return 403 if user is not admin', async () => {
          await app.logAs(TestUserBuilder.Alice());

          const response = await settingsUtils.addSetting(
            'front.theme',
            'light',
            'default',
            undefined
          );

          expect(response.status).toBe(403);
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
    describe('by default', () => {
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

    describe('when getting user settings', () => {
      describe('error cases', () => {
        it('should return 403 if user is not logged', async () => {
          await app.logAs(null);

          const response = await settingsUtils.getSettings(
            'user',
            TestUserBuilder.Alice().uid
          );

          expect(response.status).toBe(403);
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
