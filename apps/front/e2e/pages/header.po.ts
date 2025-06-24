import { Locator, Page } from '@playwright/test';

import { BasePo } from './base.po';

export class HeaderPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.header');
    }
    get headerTitle(): Locator {
        return this.pageLocator.locator('a[routerlink="/"]');
    }
    get loginBtn(): Locator {
        return this.pageLocator.locator('button[routerlink="/login"]');
    }
    get registerBtn(): Locator {
        return this.pageLocator.locator('button[routerlink="/register"]');
    }
    get dashboardBtn(): Locator {
        return this.pageLocator.locator('button[routerlink="/dashboard"]');
    }
    get logoutBtn(): Locator {
        return this.pageLocator.getByRole('button', {
            name: this.translator.get('home.header.logoutLink'),
          });
    }

    constructor(page: Page) {
        super(page);
    }

    async redirectLogin(): Promise<void> {
        await this.loginBtn.click();
    }

    async redirectRegister(): Promise<void> {
        await this.registerBtn.click();
    }

    async redirectDashboard(): Promise<void> {
        await this.dashboardBtn.click();
    }

    async redirectLogout(): Promise<void> {
        await this.logoutBtn.click();
    }

}