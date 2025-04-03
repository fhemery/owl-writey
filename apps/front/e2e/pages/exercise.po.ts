import { expect, Locator } from '@playwright/test';

import { BasePo } from './base.po';

export class ExercisePo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.exercise-page');
    }

    async goTo(): Promise<void> {
        await this.page.goto('/exercises');
    }
    
    async shouldBeDisplayed(): Promise<void> {
        await expect(this.pageLocator).toBeVisible();
    }

}