import { test } from '@playwright/test';

import { DashboardPo } from '../pages/dashboard.po';
import { LoginPo } from '../pages/login.po';
import { RegisterPo } from '../pages/register.po';

test.describe('Login page', () => {
  let loginPo: LoginPo;
  let dashboardPo: DashboardPo;
  let registerPo: RegisterPo;

  test.beforeEach(async ({ page }) => {
    loginPo = new LoginPo(page);
    dashboardPo = new DashboardPo(page);
    registerPo = new RegisterPo(page);
    await loginPo.goTo();
  });

  

});
