import { Locator } from '@playwright/test';

import { BasePo } from './base.po';

export class headerPo extends BasePo {
    get pageLocator(): Locator {
        return this.page.locator('.header-page');
    }
}