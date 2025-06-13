import { TestUserBuilder } from '@owl/back/test-utils';

import { SettingScopeErrors, SettingScopeHandler } from '../lib/domain/model';
import { SettingsService } from '../lib/domain/ports';
import { app, moduleTestInit, settingsUtils } from './module-test-init';

class TestScopeHandler implements SettingScopeHandler {
  errorsToReturn: SettingScopeErrors = [];
  checkSettingUpdate(): SettingScopeErrors {
    return this.errorsToReturn;
  }
  checkSettingAccess(): SettingScopeErrors {
    return this.errorsToReturn;
  }
}

describe('Settings specific scope', () => {
  let testScopeHandler: TestScopeHandler;

  void moduleTestInit();

  describe('PATCH /api/settings', () => {
    describe('general errors', () => {
      it('should return 400 if scope is not registered', async () => {
        await app.logAs(TestUserBuilder.Admin());

        const response = await settingsUtils.addSetting(
          'front.theme',
          'light',
          'unknownScope',
          'unknownScopeId'
        );

        expect(response.status).toBe(400);
      });
    });

    describe('when a scope is registered', () => {
      beforeEach(() => {
        testScopeHandler = new TestScopeHandler();
        const settingsService = app.getInstance(SettingsService);
        settingsService.registerSettingScope('testScope', testScopeHandler);
      });

      it('should return 204 if scope is correct', async () => {
        await app.logAs(TestUserBuilder.Alice());
        testScopeHandler.errorsToReturn = [];

        const response = await settingsUtils.addSetting(
          'front.theme',
          'light',
          'testScope',
          'testScopeId'
        );

        expect(response.status).toBe(204);
      });

      it('should return 400 if scope returns an error', async () => {
        await app.logAs(TestUserBuilder.Alice());
        testScopeHandler.errorsToReturn = ['error'];

        const response = await settingsUtils.addSetting(
          'front.theme',
          'light',
          'testScope',
          'testScopeId'
        );

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /api/settings', () => {
    describe('error cases', () => {
      it('should return 400 if scope is not registered', async () => {
        await app.logAs(TestUserBuilder.Admin());

        const response = await settingsUtils.getSettings(
          'unknownScope',
          'unknownScopeId'
        );
        expect(response.status).toBe(400);
      });

      it('should return 204 if scope is correct', async () => {
        await app.logAs(TestUserBuilder.Alice());
        testScopeHandler.errorsToReturn = [];

        await settingsUtils.addSetting(
          'test.theme',
          'light',
          'testScope',
          'testScopeId'
        );

        const response = await settingsUtils.getSettings(
          'testScope',
          'testScopeId'
        );

        expect(response.status).toBe(200);
        const setting = response.body?.settings?.find(
          (s) => s.key === 'test.theme'
        );
        expect(setting?.value).toBe('light');
      });

      it('should return 400 if scope returns an error', async () => {
        await app.logAs(TestUserBuilder.Alice());
        testScopeHandler.errorsToReturn = ['error'];

        const response = await settingsUtils.getSettings(
          'testScope',
          'testScopeId'
        );

        expect(response.status).toBe(400);
      });
    });
  });
});
