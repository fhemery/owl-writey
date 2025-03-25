import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class RegisterPo extends BasePo {
  get pageLocator(): Locator {
    return this.page.locator('.register-page');
  }
  get nameInput(): Locator {
    return this.pageLocator.locator('input[name=name]');
  }
  get emailInput(): Locator {
    return this.pageLocator.locator('input[name=email]');
  }
  get passwordInput(): Locator {
    return this.pageLocator.locator('input[name=password]');
  }
  get repeatPasswordInput(): Locator {
    return this.pageLocator.locator('input[name=repeatPassword]');
  }
  get submitButton(): Locator {
    return this.pageLocator.getByRole('button', {
      name: this.translator.get('register.form.submitButton.label'),
    });
  }
  get loginRedirection(): Locator {
    return this.pageLocator.locator('a[routerlink="/login"]');
  }
  get homepageRedirection(): Locator {
    return this.pageLocator.locator('a[routerlink="/"]');
  }


  constructor(page: Page) {
    super(page);
  }

  async goTo(): Promise<void> {
    await this.page.goto('/register');
  }

  async shouldBeDisplayed(): Promise<void> {
    await expect(this.pageLocator).toBeVisible();
  }

  async shouldDisplayForm(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.repeatPasswordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async registerAs(name: string, email: string, password: string, repeatedPassword: string, shouldRedirect: boolean = true): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.repeatPasswordInput.fill(repeatedPassword);
    if (shouldRedirect) {
      await Promise.all([
      this.page.waitForURL('/dashboard'),
      this.submitButton.click()
      ]);
    } else {
      await this.submitButton.click();
    }
  }

  async wronglyRegisterAs(name: string, email: string, password: string, repeatedPassword: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.repeatPasswordInput.fill(repeatedPassword);
    await this.repeatPasswordInput.blur();
  }

  async registerAsWithoutRedirect(name: string, email: string, password: string, repeatedPassword: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.repeatPasswordInput.fill(repeatedPassword);
    await this.submitButton.click();
  }

  async redirectLog(): Promise<void> {
    await this.loginRedirection.click();
  }

  async redirectHome(): Promise<void> {
    await this.homepageRedirection.click();
  }
}
