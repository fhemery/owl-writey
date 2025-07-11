import { expect, Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class NovelCardPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.novel-card');
    }
    get novelCardTitle(): Locator {
        return this.pageLocator.locator('mat-card-title');
    }
    get novelCard(): Locator {
        return this.pageLocator.locator('mat-card');
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

    getNovelCardTitle(novelName: string): Locator {
        return this.pageLocator.locator('mat-card-title', { hasText: novelName });
    }
    async displayNovelCard(novelName: string): Promise<void> {
        await this.getNovelCardTitle(novelName).click();
    }
}