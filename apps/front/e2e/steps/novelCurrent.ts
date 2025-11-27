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

Then('Display the corresponding novel', async ({ page, novelCurrentPo }: AllFixtures) => {
     const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/novels/3bde73fb-7cc2-432f-825f-61fc325f8080') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );
    
    await novelCurrentPo.shouldBeDisplayed();
    
    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
})