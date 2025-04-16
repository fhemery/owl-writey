import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class ExercisePo extends BasePo {
  get pageLocator(): Locator {
    return this.page.locator('.exercise-form');
  }
  get nameInput(): Locator{
    return this.pageLocator.locator('input[name="name"]');
  }
  get nbIterationsInput(): Locator{
    return this.pageLocator.locator('input[name="nbIterations"]');
  }
  get iterationDurationInput(): Locator{
    return this.pageLocator.locator('mat-select[formControlName="iterationDuration"]');
  }
  get minWordsInput(): Locator{
    return this.pageLocator.locator('input[name="minWords"]');
  }
  get maxWordsInput(): Locator{
    return this.pageLocator.locator('input[name="maxWords"]');
  }
  get initialTxtInput(): Locator{
    return this.pageLocator.locator('textarea[name="initialText"]');
  }
  get submitButton(): Locator {
    return this.pageLocator.getByRole('button', {
        name: this.translator.get('exercise.form.submitButton.label')
    });
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

  async shouldDisplayForm(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.nbIterationsInput).toBeVisible();
    await expect(this.iterationDurationInput).toBeVisible();
    await expect(this.minWordsInput).toBeVisible();
    await expect(this.maxWordsInput).toBeVisible();
    await expect(this.initialTxtInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async createdAs(
    name: string,
    nbIterations: string,
    iterationDuration: string,
    minWords: string,
    maxWords: string,
    initialText: string,
    shouldRedirect = true
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.nbIterationsInput.fill(nbIterations);
    await this.iterationDurationInput.fill(iterationDuration);
    await this.minWordsInput.fill(minWords);
    await this.maxWordsInput.fill(maxWords);
    await this.initialTxtInput.fill(initialText);
    if (shouldRedirect) {
      await Promise.all([
        this.page.waitForURL('/exercises'),
        this.submitButton.click(),
      ]);
    } else {
      await this.submitButton.click();
    }
  }

  async wronglyCreatedAs (
    name: string,
    nbIterations: string,
    iterationDuration: string,
    minWords: string,
    maxWords: string,
    initialText: string,
    shouldRedirect = true
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.nbIterationsInput.fill(nbIterations);
    await this.iterationDurationInput.fill(iterationDuration);
    await this.minWordsInput.fill(minWords);
    await this.maxWordsInput.fill(maxWords);
    await this.initialTxtInput.fill(initialText);
    await this.initialTxtInput.blur();
  }
}