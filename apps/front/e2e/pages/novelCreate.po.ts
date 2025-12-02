import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class NovelCreatePo extends BasePo {
  get pageLocator(): Locator {
    return this.page.locator('.novel-form');
  }
  get nameInput(): Locator {
    return this.pageLocator.locator('input[name="title"]');
  }
  get descriptionArea(): Locator {
    return this.pageLocator.locator('.novel-form__description');
  }
  get submitButton(): Locator {
    return this.pageLocator.getByRole('button', {
      name: this.translator.get('novel.form.createButton.label'),
    });
  }
  get editButton(): Locator {
    return this.pageLocator.getByRole('button', {
      name: this.translator.get('novel.form.editButton.label'),
    });
  }
  get deleteButton(): Locator {
    return this.pageLocator.getByRole('button', {
      name: this.translator.get('novel.form.deleteButton.label'),
    });
  }
  getPage(): Page {
    return this.page;
  }
  
  constructor(page: Page) {
    super(page);
  }
  
  async goTo(): Promise<void> {
    await this.page.goto('/novels');
  }

  async shouldBeDisplayed(): Promise<void> {
    await expect(this.pageLocator).toBeVisible();
  }

  async shouldDisplayForm(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.descriptionArea).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async createNovel(title: string): Promise<void> {
    await this.nameInput.fill(title);
    // await this.descriptionArea.fill(description);
    await this.submitButton.click();
  }

  async updateNovel(title: string): Promise<void> {
    await this.nameInput.fill(title);
    await this.editButton.click();
  }
  async deleteNovel(): Promise<void> {
    await this.deleteButton.click();
  }
}