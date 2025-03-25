import { test, expect } from '@playwright/test';

import { RegisterPo } from '../pages/register.po';
import { DashboardPo } from '../pages/dashboard.po';
import { LoginPo } from '../pages/login.po';

test.describe('Register page', () => {
  let registerPo: RegisterPo;
  let dashboardPo: DashboardPo;
  let loginPo: LoginPo;

  test.beforeEach(async ({ page }) => {
    registerPo = new RegisterPo(page);
    dashboardPo = new DashboardPo(page);
    loginPo = new LoginPo(page);
    await registerPo.goTo();
  });

  test('should be displayed', async() => {
    await registerPo.shouldBeDisplayed();
    await registerPo.shouldDisplayForm();
  });

  // Redirection tests
  test('should redirect to the login page on click', async () => {
    await registerPo.redirectLog();
    await loginPo.shouldBeDisplayed();
  });

  // test('should redirect to the homepage on click', async () => {
  //   await registerPo.redirectHome();
  // });

  // Valid registration
  test('should redirect to the dashboard page on successful registration', async () => {
    await registerPo.registerAs('test13', 'owl-15@hemit.fr', 'password', 'password');
    await dashboardPo.shouldBeDisplayed();
  });


  // Invalid registration - fields are wrong
  test('should display error if pseudo field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Ed', 'owl-12@hemit.fr', 'password', 'password');
    await registerPo.shouldDisplayTranslatedText('register.form.name.error.minlength');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if email field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'wrongmail', 'password', 'password');
    await registerPo.shouldDisplayTranslatedText('register.form.email.error.invalid');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if password field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', 'pswd', 'pswd');
    await registerPo.shouldDisplayTranslatedText('register.form.password.error.minlength');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if repeated password field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', 'password', 'motdepasse');
    await registerPo.shouldDisplayTranslatedText('register.form.error.passwordNotMatching');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  // Invalid registration - fields are empty
  test('should display error if pseudo field is empty', async() => {
    await registerPo.wronglyRegisterAs('', 'owl-12@hemit.fr', 'password', 'password');
    await registerPo.shouldDisplayTranslatedText('register.form.name.error.required');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if email field is empty', async() => {
    await registerPo.wronglyRegisterAs('Edward', '', 'password', 'password');
    await registerPo.shouldDisplayTranslatedText('register.form.email.error.required');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if password field is empty', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', '', 'password');
    await registerPo.shouldDisplayTranslatedText('register.form.password.error.required');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if repeated password field is empty', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', 'password', '');
    await registerPo.shouldDisplayTranslatedText('register.form.repeatPassword.error.required');
    await expect(registerPo.submitButton).toBeDisabled();
  });

  // Invalide registration - the account already exists
  test('should display error if email address already registered', async() => {
    await registerPo.registerAs('Edward', 'owl-12@hemit.fr', 'password', 'password', false);
    await registerPo.shouldDisplayTranslatedText('register.error');
  });
})
