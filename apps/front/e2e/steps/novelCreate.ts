import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am connected as a known user', async ({ loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.createNewNovel();
});

Given('Display a new novel form', async ({ novelCreatePo } : AllFixtures) => {
    await novelCreatePo.shouldDisplayForm();
});

When('I fill a new novel form with valid data', async ({ page, novelCreatePo } : AllFixtures) => {
    const apiResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/novels') && 
        response.request().method() === 'POST' && 
        response.status() === 201
    );

    await novelCreatePo.createNovel('This novel is a test');

    const response = await apiResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Then('I am redirected to the current novel', async ({ novelCurrentPo } : AllFixtures) => {
    await novelCurrentPo.shouldBeDisplayed();
});