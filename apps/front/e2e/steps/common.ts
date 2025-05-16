import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";
import { TranslationKey } from "../tools/test-translator";


export const fixtures = pageFixtures;
const { When, Then } = createBdd(fixtures);

When('I enter {string} in field {string}', async ({ commonPo } : AllFixtures, value: string, fieldName: string) => {
    await commonPo.fillInField(fieldName, value);
});
Then('It should display error {string}', async ({ commonPo } : AllFixtures, errorKey: TranslationKey) => {
    await commonPo.shouldDisplayError(errorKey);
});
