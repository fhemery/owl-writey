import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am logged', async ({ loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
});
When('I click on a novel card', async ({ novelCardPo } : AllFixtures) => {
    await novelCardPo.getNovelCardTitle('Test d\'une application de romans');
    await novelCardPo.displayNovelCard('Test d\'une application de romans');
});

Then('Display the corresponding novel', async ({ novelCurrentPo }: AllFixtures) => {
    await novelCurrentPo.shouldBeDisplayed();
})