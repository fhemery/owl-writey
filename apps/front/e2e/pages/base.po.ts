import { expect, Page } from '@playwright/test';

import { TestTranslator, TranslationKey } from '../tools/test-translator';

export abstract class BasePo {
  protected readonly page: Page;
  protected translator = new TestTranslator();

  protected constructor(page: Page) {
    this.page = page;
  }
  async shouldDisplayText(key: TranslationKey): Promise<void> {
    await expect(this.page.getByText(this.translator.get(key))).toBeVisible();
  }
}
