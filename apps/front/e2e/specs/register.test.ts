import { test, expect } from '@playwright/test';

import { RegisterPo } from '../pages/register.po';
import { DashboardPo } from '../pages/dashboard.po';
import exp from 'constants';

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
  test('should redirect to the dashboard page on successful registration', async () => {
    await registerPo.registerAs('test13', 'owl-15@hemit.fr', 'password', 'password');
    await dashboardPo.shouldBeDisplayed();
  });

  // Invalid registration - fields are wrong
  test('should display error if pseudo field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Ed', 'owl-12@hemit.fr', 'password', 'password');
    await expect(registerPo.pageLocator.getByText('Le pseudo doit contenir au moins 3 caractères')).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if email field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'wrongmail', 'password', 'password');
    await expect(registerPo.pageLocator.getByText(`Le format de l'email est incorrect`)).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if password field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', 'pswd', 'pswd');
    await expect(registerPo.pageLocator.getByText('Le mot de passe doit contenir au moins 8 caractères')).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if repeated password field is wrong', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', 'password', 'motdepasse');
    await expect(registerPo.pageLocator.getByText('Les mots de passe ne correspondent pas')).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  // Invalid registration - fields are empty
  test('should display error if pseudo field is empty', async() => {
    await registerPo.wronglyRegisterAs('', 'owl-12@hemit.fr', 'password', 'password');
    await expect(registerPo.pageLocator.getByText('Le pseudo est obligatoire')).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if email field is empty', async() => {
    await registerPo.wronglyRegisterAs('Edward', '', 'password', 'password');
    await expect(registerPo.pageLocator.getByText('Le mot de passe est obligatoire')).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if password field is empty', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', '', 'password');
    await expect(registerPo.pageLocator.getByText('Le mot de passe est obligatoire')).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  test('should display error if repeated password field is empty', async() => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-12@hemit.fr', 'password', '');
    await expect(registerPo.pageLocator.getByText('Champ obligatoire')).toBeVisible;
    await expect(registerPo.submitButton).toBeDisabled();
  });

  // Invalide registration - the account already exists
  test('should display error if email address already registered', async() => {
    await registerPo.registerAs('Edward', 'owl-12@hemit.fr', 'password', 'password');
    await registerPo.shouldDisplayText('Erreur à la création du compte. Peut-être que ce compte existe déjà');
  });
})
