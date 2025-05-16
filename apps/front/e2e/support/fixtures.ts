import { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';

import { CommonPo } from '../pages/common.po';
import { DashboardPo } from '../pages/dashboard.po';
import { ExercisePo } from '../pages/exercise.po';
import { HeaderPo } from '../pages/header.po';
import { HomePo } from '../pages/home.po';
import { LoginPo } from '../pages/login.po';
import { RegisterPo } from '../pages/register.po';

interface Pages {
  commonPo: CommonPo;
  homePo: HomePo;
  loginPo: LoginPo;
  registerPo: RegisterPo;
  dashboardPo: DashboardPo;
  exercisePo: ExercisePo;
  headerPo: HeaderPo;
}

export interface AllFixtures extends Pages {
  page: Page;
}

export const pageFixtures = base.extend<Pages>({
  commonPo: async ({ page }, use) => {
    await use(new CommonPo(page));
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
  dashboardPo: async ({ page }, use) => {
    await use(new DashboardPo(page));
  },
  exercisePo: async ({ page }, use) => {
    await use(new ExercisePo(page));
  },
  headerPo: async ({ page }, use) => {
    await use(new HeaderPo(page));
  },
});
