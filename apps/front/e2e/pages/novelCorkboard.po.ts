import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class NovelCorkboardPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.corkboard');
    }
    get newChapterIcon(): Locator {
        return this.pageLocator.locator('.corkboard__new');
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
    async addNewChapter(): Promise<void> {
        await this.newChapterIcon.click();
    }
}