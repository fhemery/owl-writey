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

  // Valid registration
  test('should redirect to the dashboard page on successful registration', async ({ page }) => {
    await registerPo.registerAs('test12', 'testing@gmail.com', 'password', 'password');
    await dashboardPo.shouldBeDisplayed();
  });

  // Invalid registration - fields are wrong
  test('should display error if pseudo field is wrong', async() => {
    await registerPo.registerAs('Ed', 'owl-12@hemit.fr', 'password', 'password');
    await registerPo.shouldDisplayText('auth.error');
  });

  test('should display error if email field is wrong', async() => {
    await registerPo.registerAs('Edward', 'wrongmail', 'password', 'password');
    await registerPo.shouldDisplayText('auth.error');
  });

  test('should display error if password field is wrong', async() => {
    await registerPo.registerAs('Edward', 'owl-12@hemit.fr', 'pswd', 'pswd');
    await registerPo.shouldDisplayText('auth.error');
  });

  test('should display error if repeated password field is wrong', async() => {
    await registerPo.registerAs('Edward', 'owl-12@hemit.fr', 'password', 'motdepasse');
    await registerPo.shouldDisplayText('auth.error');
  });

  test('should display error if email address already registered', async() => {
    await registerPo.registerAs('Edward', 'owl-12@hemit.fr', 'password', 'password');
    await registerPo.shouldDisplayText('auth.error');
  });

  // Invalid registration - fields are empty
  test('should display error if pseudo field is empty', async() => {
    await registerPo.registerAs('', 'owl-12@hemit.fr', 'password', 'password');
    await registerPo.shouldDisplayText('auth.error');
  });

  test('should display error if email field is empty', async() => {
    await registerPo.registerAs('Edward', '', 'password', 'password');
    await registerPo.shouldDisplayText('auth.error');
  });

  test('should display error if password field is empty', async() => {
    await registerPo.registerAs('Edward', 'owl-12@hemit.fr', '', 'password');
    await registerPo.shouldDisplayText('auth.error');
  });

  test('should display error if repeated password field is empty', async() => {
    await registerPo.registerAs('Edward', 'owl-12@hemit.fr', 'password', '');
    await registerPo.shouldDisplayText('auth.error');
  });
})
