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
        return this.pageLocator.locator('[data-test-id="exercise-text-editor"]');
    }
    get submitTurnButton(): Locator {
        return this.pageLocator.getByRole('button', {
            name: this.translator.get('exercise.exquisiteCorpse.submitTurn.label'),
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

    async shouldDisplayTextEditor(): Promise<void> {
        await this.takeTurnButton.click();
        await expect(this.takeTurnButton).toBeHidden();
        // await expect(this.exerciseTextEditor).toBeVisible();
    }
    async filledWith(text: string): Promise<void> {
        await this.exerciseTextEditor.fill(text);
    }
    async submitText(): Promise<void> {
        await this.submitTurnButton.click();
    }

}