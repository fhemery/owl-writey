import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class NovelOvervwChapCardPo extends BasePo {
    get pageLocator(): Locator {
            return this.page.locator('.chapter-card');
    }
    get chapterTitleField(): Locator {
        return this.pageLocator.locator('.chapter-card__title[contenteditable="true"]' );
    }
    get moveDownButton(): Locator {
        return this.pageLocator.locator('.chapter-card__move-down');
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
    async fillChapterTitle(title: string): Promise<void> {
        await this.chapterTitleField.fill(title);
    }

    getChapterCardByName(chapterName: string): Locator {
        return this.pageLocator.locator('.chapter-card:has-text("' + chapterName + '")');
    }
    async displayChapterCard(chapterName: string): Promise<void> {
        const chapterCardName = this.getChapterCardByName(chapterName);
        await expect(chapterCardName).toBeVisible();
    }
    async moveChapterDown(): Promise<void> {
        await this.moveDownButton.click();
    }
}