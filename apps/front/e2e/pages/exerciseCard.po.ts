import { expect, Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class ExerciseCardPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.exercise-card');
    }
    get exerciseCardTitle(): Locator {
        return this.pageLocator.locator('mat-card-title');
    } 
    get exerciseCard(): Locator {
        return this.pageLocator.locator('mat-card');
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

    async displayExerciseCard(): Promise<void> {
        await this.exerciseCard.click();
    }

}