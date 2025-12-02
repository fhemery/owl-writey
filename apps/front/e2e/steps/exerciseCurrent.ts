import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am logged as a user', async ({ loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
});
Given('I display the corresponding current exercise', async ({ exerciseCardPo, exerciseCurrentPo } : AllFixtures) => {
    await exerciseCardPo.getExerciseCardTitle('Test d\'exercice owl-writey');
    await exerciseCardPo.displayExerciseCard('Test d\'exercice owl-writey');
    await exerciseCurrentPo.shouldBeDisplayed();
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

When('I click to take my turn', async ({ exquisiteCorpsePo } : AllFixtures) => {
    await exquisiteCorpsePo.shouldBeDisplayed();
    await exquisiteCorpsePo.takePartToExercise();
    await exquisiteCorpsePo.shouldDisplayTextEditor();
});
Then('I can fill with content and submit it', async ({ page, exquisiteCorpsePo }: AllFixtures) => {
    await exquisiteCorpsePo.filledWith('Mon tour est arrivé');

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.submitText();

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
When('It is my turn', async ({  page, exquisiteCorpsePo } : AllFixtures) => {
    await exquisiteCorpsePo.shouldBeDisplayed();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.takePartToExercise();

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Then('I click to cancel my turn', async ({ page, exquisiteCorpsePo } : AllFixtures) => {
    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.giveUpTurn();

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
When('I click to delete an exercise', async ({  page, exerciseCurrentPo, confirmDialogPo } : AllFixtures) => {
    await exerciseCurrentPo.deleteExerciseAction();
    
    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.request().method() === 'DELETE' && 
        response.status() === 204 
    );

    await confirmDialogPo.confirmDeleteAction();

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Then('Display the dashboard page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});
When('I click to end an exercise', async ({ page, confirmDialogPo, exerciseCurrentPo } : AllFixtures) => {
    await exerciseCurrentPo.finishExerciseAction();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await confirmDialogPo.confirmDeleteAction();

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Then('Redirect to the dashboard page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});