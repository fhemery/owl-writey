import { test } from '@playwright/test';

import { DashboardPo } from '../pages/dashboard.po';
import { LoginPo } from '../pages/login.po';

test.describe('Login page', () => {
  let loginPo: LoginPo;
  let dashboardPo: DashboardPo;

  test.beforeEach(async ({ page }) => {
    loginPo = new LoginPo(page);
    dashboardPo = new DashboardPo(page);
    await loginPo.goTo();
  });

  test('should be displayed', async () => {
    await loginPo.shouldBeDisplayed();
    await loginPo.shouldDisplayHeaderAndForm();
  });

  test('should display error if wrong logins are entered', async () => {
    await loginPo.logAs('wrongLogin', 'wrongPassword');
    await loginPo.shouldDisplayTranslatedText('auth.error');
  });

  test('should redirect to the dashboard page on successful login', async () => {
    await loginPo.logAsUser('alice');
    await dashboardPo.shouldBeDisplayed();
  });
});
