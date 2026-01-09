import { expect, Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class ExquisiteCorpsePo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator(".exCo-details");
    }
    get takeTurnButton(): Locator {
        return this.pageLocator.getByRole('button', {
            name: this.translator.get('exercise.exquisiteCorpse.takeTurn.label'),
        });
    }
    get exerciseTextEditor(): Locator {
        return this.pageLocator.locator('.NgxEditor [contenteditable="true"]');
    }
    get submitTurnButton(): Locator {
        return this.pageLocator.getByRole('button', {
            name: this.translator.get('exercise.exquisiteCorpse.submitTurn.label'),
        });
    }
    get cancelTurnButton(): Locator {
        return this.pageLocator.getByRole('button', {
            name: this.translator.get('exercise.exquisiteCorpse.cancelTurn.label'),
        });
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
    async takePartToExercise(): Promise<void> {
        await this.takeTurnButton.click();
    }
    async shouldDisplayTextEditor(): Promise<void> {
        await expect(this.takeTurnButton).toBeHidden();
        // await expect(this.exerciseTextEditor).toBeVisible();
    }
    async filledWith(text: string): Promise<void> {
        await this.exerciseTextEditor.waitFor({ state: 'attached' }); 
        await this.exerciseTextEditor.waitFor({ state: 'visible' });
        await this.exerciseTextEditor.fill(text);
    }
    async submitText(): Promise<void> {
        await this.submitTurnButton.click();
    }
    async giveUpTurn(): Promise<void> {
        await this.cancelTurnButton.click();
    }

}