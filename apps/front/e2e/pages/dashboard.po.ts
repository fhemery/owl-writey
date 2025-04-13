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
  // get currentExercise(): Locator {
  //   return this.pageLocator.locator('a[routerlink="/exercises/{{ex.id}}"]');
  // }
  
  constructor(page: Page) {
    super(page);
  }
  
  async goTo(): Promise<void> {
    await this.page.goto('/dashboard');
  }
  
  async shouldBeDisplayed(): Promise<void> {
    console.log('URL:', await this.page.url());
    await expect(this.pageLocator).toBeVisible();
  }

  async createNewExercise(): Promise<void> {
    await this.newExercises.click();
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
  
  async checkFinishedExercisesIncluded(): Promise<boolean> {
    return await this.toggleBtn.isChecked();
  }

  // async displayCurrentExercise(): Promise<void> {
  //   return await this.currentExercise.click();
  // }
  
  getExerciseByTitle(title: string): Locator {
    // const exerciseTitle = this.pageLocator.locator('mat-card').filter({ hasText: title });
    const exerciseCard = this.pageLocator.locator('mat-card').filter({ 
      has: this.pageLocator.locator('mat-card-title:has-text("' + title + '")') 
    });
    // const exerciseContainer = exerciseCard;
    const playBtnLink = exerciseCard.locator('mat-card-footer .exercise-card__footer a[title="dashboard.exercises.playAlt"]');
    return playBtnLink.locator('mat-icon.accent:has-text("play_arrow")');
  }

}

