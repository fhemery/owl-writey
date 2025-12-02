import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class NovelOvervwNoChapPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.novel-overview-no-chapter');
    }
    get addChapterButton(): Locator {
        return this.pageLocator.getByRole('button', {
            name: this.translator.get('novel.overview.noChapters.button'),
        });
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

    async addFirstChapter(): Promise<void> {
        await this.addChapterButton.click();
    }
}