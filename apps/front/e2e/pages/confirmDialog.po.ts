import { Locator, Page } from "@playwright/test";

import { BasePo } from "./base.po";

export class ConfirmDialogPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.confirm-dialog');
    }
    get confirmDeleteButton(): Locator {
        return this.pageLocator.locator('.confirm-dialog__confirm-btn');
    }
    get inputDeletion(): Locator {
        return this.pageLocator.locator('input[name="name"]');
    }
    
    getPage(): Page {
        return this.page;
    }
    constructor(page: Page) {
        super(page);
    }
    
    async filledAs(title: string): Promise<void> {
        await this.inputDeletion.fill(title);
    }

    async confirmDeleteAction(): Promise<void> {
        await this.confirmDeleteButton.click();
    }
}