import { expect, Page } from '@playwright/test';

import { TestTranslator } from '../tools/test-translator';

export abstract class BasePo {
  protected readonly page: Page;
  protected translator = new TestTranslator();

  protected constructor(page: Page) {
    this.page = page;
  }
  async shouldDisplayTranslatedText(text: string): Promise<void> {
    await expect(this.page.getByText(this.translator.get(text))).toBeVisible();
  }
  async shouldDisplayText(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }
}
