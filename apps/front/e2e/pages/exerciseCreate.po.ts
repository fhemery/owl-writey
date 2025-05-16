import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class ExerciseCreatePo extends BasePo {

  get pageLocator(): Locator {
    return this.page.locator('.exercise-form');
  }
  get nameInput(): Locator {
    return this.pageLocator.locator('input[name="name"]');
  }
  get nbIterationsInput(): Locator {
    return this.pageLocator.locator('input[name="nbIterations"]');
  }
  get iterationDurationInput(): Locator {
    return this.pageLocator.locator(
      'mat-select[formControlName="iterationDuration"]'
    );
  }
  get minWordsInput(): Locator {
    return this.pageLocator.locator('input[name="minWords"]');
  }
  get maxWordsInput(): Locator {
    return this.pageLocator.locator('input[name="maxWords"]');
  }
  get initialTxtInput(): Locator {
    return this.pageLocator.locator('textarea[name="initialText"]');
  }
  get submitButton(): Locator {
    return this.pageLocator.getByRole('button', {
      name: this.translator.get('exercise.form.submitButton.label'),
    });
  }
  get exerciseTitle(): Locator {
    return this.page.locator('h1');
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

  async shouldDisplayForm(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.nbIterationsInput).toBeVisible();
    await expect(this.iterationDurationInput).toBeVisible();
    await expect(this.minWordsInput).toBeVisible();
    await expect(this.maxWordsInput).toBeVisible();
    await expect(this.initialTxtInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async shouldDisplayExercise(expectedTitle: string): Promise<void> {
    //  expect(await this.page.locator('h1').innerText()).toContain(this.nameInput);
    expect(this.page.url()).toContain('/exercises/');
    await expect(this.exerciseTitle).toBeVisible();
    await expect(this.exerciseTitle).toContainText(expectedTitle);
  }

  async createdAs(
    name: string,
    nbIterations: string,
    iterationDurationOption: string,
    minWords: string,
    maxWords: string,
    initialText: string,
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.nbIterationsInput.fill(nbIterations);

    await this.changeDuration(iterationDurationOption);

    await this.minWordsInput.fill(minWords);
    await this.maxWordsInput.fill(maxWords);
    await this.initialTxtInput.fill(initialText);

    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async wronglyCreatedAs(
    name: string,
    nbIterations: string,
    iterationDuration: string,
    minWords: string,
    maxWords: string,
    initialText: string
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.nbIterationsInput.fill(nbIterations);
    await this.changeDuration(iterationDuration);
    await this.minWordsInput.fill(minWords);
    await this.maxWordsInput.fill(maxWords);
    await this.initialTxtInput.fill(initialText);
    await this.initialTxtInput.blur();
  }

  async changeDuration(textValue: string): Promise<void> {
    await this.iterationDurationInput.click();
    await this.page.getByRole('option', { name: textValue, exact: true }).click();
  }

  async shouldDisplayDuration(durationValue: string): Promise<void> {
    await expect(this.iterationDurationInput).toContainText(durationValue);
    await expect(this.page.getByRole('option')).toHaveCount(0);
  }
}
