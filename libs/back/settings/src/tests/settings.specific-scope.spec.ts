import { TestUserBuilder } from '@owl/back/test-utils';

import { app, moduleTestInit, settingsUtils } from './module-test-init';

describe('Settings specific scope', () => {
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
    });
  });
});
