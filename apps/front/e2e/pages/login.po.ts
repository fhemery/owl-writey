import { expect, Locator, Page } from '@playwright/test';

import { Auth } from '../tools/auth';
import { BasePo } from './base.po';

export class LoginPo extends BasePo {
  private auth = new Auth();
  get pageLocator(): Locator {
    return this.page.locator('.login-page');
  }
  get loginInput(): Locator {
    return this.pageLocator.locator('input[name=login]');
  }
  get passwordInput(): Locator {
    return this.pageLocator.locator('input[name=password]');
  }
  get submitButton(): Locator {
    return this.pageLocator.getByRole('button', {
      name: this.translator.get('auth.form.submitButton.label'),
    });
  }
  get registerRedirection(): Locator {
    return this.pageLocator.locator('a[routerlink="/register"]');
  }

  constructor(page: Page) {
    super(page);
  }

  async goTo(): Promise<void> {
    await this.page.goto('/login');
  }

  async shouldBeDisplayed(): Promise<void> {
    await expect(this.pageLocator).toBeVisible();
  }

  async shouldDisplayHeaderAndForm(): Promise<void> {
    expect(await this.page.locator('h2').innerText()).toContain(
      this.translator.get('auth.title')
    );
    await expect(this.loginInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async logAs(login: string, password: string): Promise<void> {
    await this.loginInput.fill(login);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logAsUser(userName: 'alice' | 'bob'): Promise<void> {
    const user = this.auth.getUser(userName);
    await this.logAs(user.login, user.password);
  }

  async wronglyLoggedAs(userName: string, password: string): Promise<void> {
    await this.loginInput.fill(userName);
    await this.passwordInput.fill(password);
    await this.passwordInput.blur();
  }

  async redirectRegister(): Promise<void> {
    await this.registerRedirection.click();
  }
}
