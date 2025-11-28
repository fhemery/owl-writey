import { expect, Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class ExerciseCurrentPo extends BasePo {

    get pageLocator(): Locator {
        return this.page.locator('.exercise-page');
    }
    get takeTurnButton(): Locator {
        return this.pageLocator.getByRole('button', {
            name: this.translator.get('exercise.exquisiteCorpse.takeTurn.label'),
        });
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
    get exerciseTextEditor(): Locator {
        return this.pageLocator.locator('[data-testid="exercise-text-editor"]');
    }

    get deleteButton(): Locator {
        return this.pageLocator.locator('.exercise-toolbar__delete');
    }
    get confirmDeleteExerciseButton(): Locator {
        return this.pageLocator.locator('.confirm-dialog__confirm-btn');
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

    async shouldDisplayTextEditor(): Promise<void> {
        await this.takeTurnButton.click();
        await expect(this.exerciseTextEditor).toBeVisible();
    }

    async filledWith(text: string): Promise<void> {
        await this.exerciseTextEditor.fill(text);
        await this.submitTurnButton.click();
    }
    
    async deleteExerciseAction(): Promise<void> {
        await this.deleteButton.click();
        await this.confirmDeleteExerciseButton.click();
    }
}
