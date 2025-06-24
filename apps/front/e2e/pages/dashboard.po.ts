import { expect, Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class DashboardPo extends BasePo { 
  get pageLocator(): Locator {
    return this.page.locator('.dashboard-page');
  }
  get newExercises(): Locator {
    return this.pageLocator.locator('button[routerlink="/exercises/new"]');
  }
  get toggleBtn(): Locator {
    return this.pageLocator.getByRole('switch', {
      name: this.translator.get('dashboard.exercises.includeFinished')
    });
  }
  get currentExercise(): Locator {
    return this.pageLocator.locator('h1', {
      hasText: this.translator.get('dashboard.exercises.title')
    });
  }
  get newNovels(): Locator {
    return this.pageLocator.locator('button[routerlink="/novels/new"]');
  }
  
  constructor(page: Page) {
    super(page);
  }
  
  async goTo(): Promise<void> {
    await this.page.goto('/dashboard');
  }
  
  async shouldBeDisplayed(): Promise<void> {
    // console.log('URL:', this.page.url());
    await expect(this.pageLocator).toBeVisible();
  }

  async createNewExercise(): Promise<void> {
    await this.newExercises.click();
  }

  async displayEndedExercises(): Promise<void> {
    return await this.toggleBtn.click();
    
    // try {
    //   await this.page.waitForSelector('exercise-card__finished', {
    //     state: 'visible',
    //     timeout: 2000
    //   });
    //   return true;
    // } catch (error){
    //   return false;
    // }
  }
  
  async checkFinishedExercisesIncluded(): Promise<boolean> {
    return await this.toggleBtn.isChecked();
  }

  async displayCurrentExercise(): Promise<void> {
    return await this.currentExercise.click();
  }
  
  // getExerciseByTitle(title: string): Locator {
    
  // }

}

