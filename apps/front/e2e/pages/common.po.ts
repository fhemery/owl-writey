import { expect, Page } from '@playwright/test';

import { TranslationKey } from '../tools/test-translator';
import { BasePo } from './base.po';

export class CommonPo extends BasePo { 
    constructor(page: Page) {
    super(page);
  }
    async fillInField(fieldName: string, value: string): Promise<void> {
        const field = this.page.locator(`input[name="${fieldName}"]`);
        await expect(field).toBeVisible();
        await field.fill(value);
        await field.blur();
    }
    async shouldDisplayError(errorKey: TranslationKey): Promise<void> {
      await this.shouldDisplayTranslatedText(errorKey);
    }
}