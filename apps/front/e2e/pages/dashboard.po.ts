import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class DashboardPo extends BasePo { 
  get pageLocator(): Locator {
    return this.page.locator('.dashboard-page');
  }

  get toggleBtn(): Locator {
    return this.pageLocator.getByRole('switch', {
      name: this.translator.get('dashboard.exercises.includeFinished')
    });
  }

  get newExercices(): Locator {
    return this.pageLocator.locator('a[routerlink="/exerces/new"]');
  }

  constructor(page: Page) {
    super(page);
  }

  async goTo(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async shouldBeDisplayed(): Promise<void> {
    await expect(this.pageLocator).toBeVisible();
  }

  async displayEndedExercises(): Promise<boolean> {
    await this.toggleBtn.click();

    try {
      await this.page.waitForSelector('exercise-card__finished', {
        state: 'visible',
        timeout: 2000
      });
      return true;
    } catch (error){
      return false;
    }
  }

  async createNewExercise(): Promise<void> {
    await this.newExercices.click();
  }
}
