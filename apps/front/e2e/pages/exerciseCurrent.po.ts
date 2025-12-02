import { expect, Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class ExerciseCurrentPo extends BasePo {

    get pageLocator(): Locator {
        return this.page.locator('.exercise-page');
    }
    // get exerciseTextEditor(): Locator {
    //     return this.pageLocator.locator('[data-testid="exercise-text-editor"]');
    // }
    get deleteButton(): Locator {
        return this.pageLocator.locator('.exercise-toolbar__delete');
    }
    get finishButton(): Locator {
        return this.pageLocator.locator('.exercise-toolbar__finish');
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
    
    async deleteExerciseAction(): Promise<void> {
        await this.deleteButton.click();
    }

    async finishExerciseAction(): Promise<void> {
        await this.finishButton.click();
    }
}
