import { test } from '@playwright/test';

import { DashboardPo } from '../pages/dashboard.po';
import { LoginPo } from '../pages/login.po';
import { RegisterPo } from '../pages/register.po';

test.describe('Login page', () => {
  let loginPo: LoginPo;
  let dashboardPo: DashboardPo;
  let registerPo: RegisterPo;

  test.beforeEach(async ({ page }) => {
    loginPo = new LoginPo(page);
    dashboardPo = new DashboardPo(page);
    registerPo = new RegisterPo(page);
    await loginPo.goTo();
  });

  test('should be displayed', async () => {
    await loginPo.shouldBeDisplayed();
    await loginPo.shouldDisplayHeaderAndForm();
  });

  // Redirection tests
  test('should redirect on registration page on click', async () => {
    await loginPo.redirectRegister();
    await registerPo.shouldBeDisplayed();
  })

  // Valid tests
  test('should redirect to the dashboard page on successful login', async () => {
    await loginPo.logAsUser('bob');
    await dashboardPo.shouldBeDisplayed();
  });

  // Invalid tests
  test('should display error if wrong logins are entered', async () => {
    await loginPo.logAs('wrongLogin', 'wrongPassword');
    await loginPo.shouldDisplayTranslatedText('auth.error');
  });

  // test('should display error if login fields are empty', async () => {
  //   await loginPo.wronglyLoggedAs('', '');
  // });

});
