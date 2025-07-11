import { expect, Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class NovelCurrentPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.novel-page');
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