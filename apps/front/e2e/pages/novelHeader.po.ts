import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class NovelHeaderPo extends BasePo {
    get pageLocator(): Locator {
    return this.page.locator('.novel-header');
    }
    get settingsButton(): Locator {
        return this.pageLocator.locator("a:has(mat-icon:text('settings'))");
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

    async updateInfo(): Promise<void> {
        await this.settingsButton.click();
    }
}