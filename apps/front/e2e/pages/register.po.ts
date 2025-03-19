import { expect, Locator, Page } from '@playwright/test';

import { Auth } from '../tools/auth';
import { BasePo } from './base.po';

export class SigninPo extends BasePo {
  get pageLocator(): Locator {
    return this.page.locator('.register-page');
  }
  get nameInput(): Locator {
    return this.pageLocator.locator('imput[name=name]');
  }
  get emailInput(): Locator {
    return this.pageLocator.locator('imput[name=email]');
  }
  get passwordInput(): Locator {
    return this.pageLocator.locator('imput[name=password]');
  }
  get repeatPasswordInput(): Locator {
    return this.pageLocator.locator('imput[name=repeatPassword]');
  }
  get submitButton(): Locator {
    return this.pageLocator.getByRole('button', {
      name: this.translator.get('register.form.submitButton.label'),
    });
  }

  constructor(page: Page) {
    super(page);
  }

  async goTo(): Promise<void> {
    await this.page.goto('/register');
  }
}
