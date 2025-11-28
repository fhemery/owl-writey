import { Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class ConfirmDialogPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.confirm-dialog');
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

    async confirmDeleteExercise(): Promise<void> {
        await this.confirmDeleteExerciseButton.click();
    }
}