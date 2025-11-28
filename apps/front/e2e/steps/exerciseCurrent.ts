import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am logged as a user', async ({ loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
});
When('I click on an exercise card', async ({ exerciseCardPo } : AllFixtures) => {
    await exerciseCardPo.getExerciseCardTitle('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    await exerciseCardPo.displayExerciseCard('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
});
Then('Display the current corresponding exercise', async ({ page, exerciseCurrentPo }: AllFixtures) => {
    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exercises/425f499a-b82f-4781-a183-5cab2099c4d7') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );

    await exerciseCurrentPo.shouldBeDisplayed();

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Given('I display the corresponding exercise', async ({ exerciseCardPo, exerciseCurrentPo } : AllFixtures) => {
    await exerciseCardPo.getExerciseCardTitle('Ceci est un test');
    await exerciseCardPo.displayExerciseCard('Ceci est un test');
    await exerciseCurrentPo.shouldBeDisplayed();
});
When('I click to take my turn', async ({ exerciseCurrentPo } : AllFixtures) => {
    await exerciseCurrentPo.shouldDisplayTextEditor();
});
Then('I can fill with content and submit it', async ({ exerciseCurrentPo }: AllFixtures) => {
    await exerciseCurrentPo.filledWith('Ce texte a été écrit par un ordinateur');
});
Given('I display the corresponding current exercise', async ({ exerciseCardPo, exerciseCurrentPo } : AllFixtures) => {
    await exerciseCardPo.getExerciseCardTitle('Test d\'exercice owl-writey');
    await exerciseCardPo.displayExerciseCard('Test d\'exercice owl-writey');
    await exerciseCurrentPo.shouldBeDisplayed();
});
When('I click to delete an exercise', async ({ exerciseCurrentPo } : AllFixtures) => {
    await exerciseCurrentPo.deleteExerciseAction();
});
Then('Display the dashboard page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});