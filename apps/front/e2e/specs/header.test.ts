import { expect, test } from '@playwright/test';

import { DashboardPo } from '../pages/dashboard.po';
import { HeaderPo } from '../pages/header.po';
import { HomePo } from '../pages/home.po';
import { LoginPo } from '../pages/login.po';
import { RegisterPo } from '../pages/register.po';

test.describe('Header', () => {
    let headerPo: HeaderPo;
    let loginPo: LoginPo;
    let dashboardPo: DashboardPo;
    let registerPo: RegisterPo;
    let homePo: HomePo;

    test.beforeEach(async ({ page }) => {
        headerPo = new HeaderPo(page);
        loginPo = new LoginPo(page);
        dashboardPo = new DashboardPo(page);
        registerPo = new RegisterPo(page);
        homePo = new HomePo(page);
        await homePo.goTo();
    });

    test('should show the user is not connected', async () => {
        await expect(headerPo.dashboardBtn).toBeHidden();
        await expect(headerPo.logoutBtn).toBeHidden();
        await expect(headerPo.loginBtn).toBeVisible();
        await expect(headerPo.registerBtn).toBeVisible();
    });

    test('should show the user is connected', async () => {
        await expect(headerPo.loginBtn).toBeHidden();
        await expect(headerPo.registerBtn).toBeHidden();
        await expect(headerPo.dashboardBtn).toBeVisible();
        await expect(headerPo.logoutBtn).toBeVisible();
    });

    test('should redirect to the login page on click from the header', async () => {
        await headerPo.redirectLogin();
        await loginPo.shouldBeDisplayed();
    });

    test('should redirect to the register page on click from the header', async () => {
        await headerPo.redirectRegister();
        await registerPo.shouldBeDisplayed();
    });

    test('should redirect to the dashboard page on click from the header', async () => {
        await headerPo.redirectDashboard();
        await dashboardPo.shouldBeDisplayed();
    });

    test('should redirect to the homepage page on logout click from the header', async () => {
        await headerPo.redirectLogout();
        await homePo.shouldBeDisplayed();
    });

})