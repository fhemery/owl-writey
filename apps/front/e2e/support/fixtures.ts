import { test as base } from 'playwright-bdd';

import { DashboardPo } from '../pages/dashboard.po';
import { HomePo } from '../pages/home.po';
import { LoginPo } from '../pages/login.po';
import { RegisterPo } from '../pages/register.po';
import { ExercisePo } from '../pages/exercise.po';

interface Pages {
  homePo: HomePo;
  loginPo: LoginPo;
  registerPo: RegisterPo;
  dashboardPo: DashboardPo;
  exercisePo: ExercisePo;
}

export const pageFixtures = base.extend<Pages>({
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
});
