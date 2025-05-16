import { expect, Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class ExerciseCurrentPo extends BasePo {

    get pageLocator(): Locator {
        return this.page.locator('.exercise-page');
    }

    getPage(): Page {
        return this.page;
    }

    constructor(page: Page) {
        super(page);
    }

    async goTo(): Promise<void> {
        await this.page.goto('/exercises');
    }
    
    async shouldBeDisplayed(): Promise<void> {
        await expect(this.pageLocator).toBeVisible();
    }
    

}
