import { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';

import { CommonPo } from '../pages/common.po';
import { ConfirmDialogPo } from '../pages/confirmDialog.po';
import { DashboardPo } from '../pages/dashboard.po';
import { ExerciseCardPo } from '../pages/exerciseCard.po';
import { ExerciseCreatePo } from '../pages/exerciseCreate.po';
import { ExerciseCurrentPo } from '../pages/exerciseCurrent.po';
import { HeaderPo } from '../pages/header.po';
import { HomePo } from '../pages/home.po';
import { LoginPo } from '../pages/login.po';
import { NovelCardPo } from '../pages/novelCard.po';
import { NovelCreatePo } from '../pages/novelCreate.po';
import { NovelCurrentPo } from '../pages/novelCurrent.po';
import { RegisterPo } from '../pages/register.po';

interface Pages {
  commonPo: CommonPo;
  confirmDialogPo: ConfirmDialogPo;
  dashboardPo: DashboardPo;
  exerciseCardPo: ExerciseCardPo;
  exerciseCreatePo: ExerciseCreatePo;
  exerciseCurrentPo: ExerciseCurrentPo;
  headerPo: HeaderPo;
  homePo: HomePo;
  loginPo: LoginPo;
  novelCardPo: NovelCardPo;
  novelCreatePo: NovelCreatePo;
  novelCurrentPo: NovelCurrentPo;
  registerPo: RegisterPo;
}

export interface AllFixtures extends Pages {
  page: Page;
}

export const pageFixtures = base.extend<Pages>({
  commonPo: async ({ page }, use) => {
    await use(new CommonPo(page));
  },
  confirmDialogPo: async ({ page }, use) => {
    await use(new ConfirmDialogPo(page));
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
  novelCardPo: async ({ page }, use) => {
    await use(new NovelCardPo(page));
  },
  novelCreatePo: async ({ page }, use) => {
    await use(new NovelCreatePo(page));
  },
  novelCurrentPo: async ({ page }, use) => {
    await use(new NovelCurrentPo(page));
  },
  registerPo: async ({ page }, use) => {
    await use(new RegisterPo(page));
  },
});
