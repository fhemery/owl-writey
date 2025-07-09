import { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';

import { CommonPo } from '../pages/common.po';
import { DashboardPo } from '../pages/dashboard.po';
import { ExerciseCardPo } from '../pages/exerciseCard.po';
import { ExerciseCreatePo } from '../pages/exerciseCreate.po';
import { ExerciseCurrentPo } from '../pages/exerciseCurrent.po';
import { HeaderPo } from '../pages/header.po';
import { HomePo } from '../pages/home.po';
import { LoginPo } from '../pages/login.po';
import { RegisterPo } from '../pages/register.po';

interface Pages {
  commonPo: CommonPo;
  dashboardPo: DashboardPo;
  exerciseCardPo: ExerciseCardPo;
  exerciseCreatePo: ExerciseCreatePo;
  exerciseCurrentPo: ExerciseCurrentPo;
  headerPo: HeaderPo;
  homePo: HomePo;
  loginPo: LoginPo;
  registerPo: RegisterPo;
}

export interface AllFixtures extends Pages {
  page: Page;
}

export const pageFixtures = base.extend<Pages>({
  commonPo: async ({ page }, use) => {
    await use(new CommonPo(page));
  },
  dashboardPo: async ({ page }, use) => {
    await use(new DashboardPo(page));
  },
  exerciseCardPo: async ({ page }, use) => {
    await use(new ExerciseCardPo(page));
  },
  exerciseCreatePo: async ({ page }, use) => {
    await use(new ExerciseCreatePo(page));
  },
  exerciseCurrentPo: async ({ page }, use) => {
    await use(new ExerciseCurrentPo(page));
  },
  headerPo: async ({ page }, use) => {
    await use(new HeaderPo(page));
  },
  homePo: async ({ page }, use) => {
    await use(new HomePo(page));
  },
  loginPo: async ({ page }, use) => {
    await use(new LoginPo(page));
  },
  registerPo: async ({ page }, use) => {
    await use(new RegisterPo(page));
  },
});
