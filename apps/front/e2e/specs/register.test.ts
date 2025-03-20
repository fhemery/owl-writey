import { test } from '@playwright/test';

import { RegisterPo } from '../pages/register.po';
import { DashboardPo } from '../pages/dashboard.po';

test.describe('Register page', () => {
  let registerPo: RegisterPo;
  let dashboardPo: DashboardPo;

  test.beforeEach(async ({ page }) => {
    registerPo = new RegisterPo(page);
    dashboardPo = new DashboardPo(page);
    await registerPo.goTo();
  });

  test('should be displayed', async() => {
    await registerPo.shouldBeDisplayed();
    await registerPo.shouldDisplayForm();
  });

  test('should redirect to the dashboard page on successful registration', async ({ page }) => {
    await registerPo.registerAs('test12', 'testing@gmail.com', 'password', 'password');
    // await page.waitForLoadState();
    await dashboardPo.shouldBeDisplayed();
  });
})
