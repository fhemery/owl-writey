import { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';

import { CommonPo } from '../pages/common.po';
import { ConfirmDialogPo } from '../pages/confirmDialog.po';
import { DashboardPo } from '../pages/dashboard.po';
import { ExerciseCardPo } from '../pages/exerciseCard.po';
import { ExerciseCreatePo } from '../pages/exerciseCreate.po';
import { ExerciseCurrentPo } from '../pages/exerciseCurrent.po';
import { ExquisiteCorpsePo } from '../pages/exquisiteCorpse.po';
import { HeaderPo } from '../pages/header.po';
import { HomePo } from '../pages/home.po';
import { LoginPo } from '../pages/login.po';
import { NovelCardPo } from '../pages/novelCard.po';
import { NovelCorkboardPo } from '../pages/novelCorkboard.po';
import { NovelCreatePo } from '../pages/novelCreate.po';
import { NovelCurrentPo } from '../pages/novelCurrent.po';
import { NovelHeaderPo } from '../pages/novelHeader.po';
import { NovelOvervwChapCardPo } from '../pages/novelOvervwChapCard.po';
import { NovelOvervwNoChapPo } from '../pages/novelOvervwNoChap.po';
import { RegisterPo } from '../pages/register.po';

interface Pages {
  commonPo: CommonPo;
  confirmDialogPo: ConfirmDialogPo;
  dashboardPo: DashboardPo;
  exquisiteCorpsePo: ExquisiteCorpsePo;
  exerciseCardPo: ExerciseCardPo;
  exerciseCreatePo: ExerciseCreatePo;
  exerciseCurrentPo: ExerciseCurrentPo;
  headerPo: HeaderPo;
  homePo: HomePo;
  loginPo: LoginPo;
  novelCardPo: NovelCardPo;
  novelCorkboardPo: NovelCorkboardPo;
  novelCreatePo: NovelCreatePo;
  novelCurrentPo: NovelCurrentPo;
  novelHeaderPo: NovelHeaderPo;
  novelOvervwChapCardPo: NovelOvervwChapCardPo;
  novelOvervwNoChapPo: NovelOvervwNoChapPo;
  registerPo: RegisterPo;
}

export interface AllFixtures extends Pages {
  page: Page;
}

export const pageFixtures = base.extend<Pages>({
  page: async ({ page, browserName }, use) => {
    if (browserName === 'webkit') {
      await page.addInitScript(() => {
        if (!window.requestIdleCallback) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ( window as any ).requestIdleCallback = (cb: any): NodeJS.Timeout => {
            const start = Date.now();
            return setTimeout(() => {
              cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
              });
            }, 1);
          };
        }
      });
    }
    await use(page);
  },
  commonPo: async ({ page }, use) => {
    await use(new CommonPo(page));
  },
  confirmDialogPo: async ({ page }, use) => {
    await use(new ConfirmDialogPo(page));
  },
  dashboardPo: async ({ page }, use) => {
    await use(new DashboardPo(page));
  },
  exquisiteCorpsePo: async ({ page }, use) => {
    await use(new ExquisiteCorpsePo(page));
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
  novelCorkboardPo: async ({ page }, use) => {
    await use(new NovelCorkboardPo(page));
  },
  novelCreatePo: async ({ page }, use) => {
    await use(new NovelCreatePo(page));
  },
  novelCurrentPo: async ({ page }, use) => {
    await use(new NovelCurrentPo(page));
  },
  novelHeaderPo: async ({ page }, use) => {
    await use(new NovelHeaderPo(page));
  },
  novelOvervwChapCardPo: async ({ page }, use) => {
    await use(new NovelOvervwChapCardPo(page));
  },
  novelOvervwNoChapPo: async ({ page }, use) => {
    await use(new NovelOvervwNoChapPo(page));
  },
  registerPo: async ({ page }, use) => {
    await use(new RegisterPo(page));
  },
});
