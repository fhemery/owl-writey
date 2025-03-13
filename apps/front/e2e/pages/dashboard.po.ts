import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class DashboardPo extends BasePo {
  constructor(page: Page) {
    super(page);
  }

  get pageLocator(): Locator {
    return this.page.locator('.dashboard-page');
  }

  async shouldBeDisplayed(): Promise<void> {
    await expect(this.pageLocator).toBeVisible();
  }
}
