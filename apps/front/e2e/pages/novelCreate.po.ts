import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class NovelCreatePo extends BasePo {
  get pageLocator(): Locator {
    return this.page.locator('.novel-form');
  }
  get nameInput(): Locator {
    return this.pageLocator.locator('input[name="name"]');
  }

  getPage(): Page {
    return this.page;
  }
  
  constructor(page: Page) {
    super(page);
  }
  
  async goTo(): Promise<void> {
    await this.page.goto('/novels');
  }

  async shouldBeDisplayed(): Promise<void> {
    await expect(this.pageLocator).toBeVisible();
  }
}