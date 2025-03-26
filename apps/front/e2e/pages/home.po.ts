import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class HomePo extends BasePo {
  get pageLocator(): Locator {
    return this.page.locator('.home-page');
  }
  get loginButton(): Locator {
    // return this.pageLocator.locator('a[routerlink="/login"]');
    return this.pageLocator.getByRole('button', {
      name: 'Connexion',
    });
  }
  get registerButton(): Locator {
    // return this.pageLocator.locator('a[routerlink="/register"]');
    return this.pageLocator.getByRole('button', {
      name: 'Inscription',
    });
  }
  get dashboardButton(): Locator {
    // return this.pageLocator.locator('a[routerlink="/dashboard"]');
    return this.pageLocator.getByRole('button', {
      name: 'Dashboard',
    });
  }

  constructor(page: Page) {
    super(page);
  }

  async goTo(): Promise<void> {
    await this.page.goto('/');
  }

  async shouldBeDisplayed(): Promise<void> {
    await expect(this.pageLocator).toBeVisible();
  }

  async loginRedirect(): Promise<void> {
    await this.loginButton.click();
  }

  async registerRedirect(): Promise<void> {
    await this.registerButton.click();
  }

  async dashboardRedirect(): Promise<void> {
    await this.dashboardButton.click();
  }
  async redirectionBtns(): Promise<void> {
    console.log('To fix');
  }
}
