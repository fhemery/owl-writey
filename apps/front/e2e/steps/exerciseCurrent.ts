import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am logged as a user', async ({ page, loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/users/') && 
        !response.url().includes('/events') &&
        response.request().method() === 'GET' && 
        response.status() === 200 
    );

    const eventsApiPromise = page.waitForResponse(response =>
        response.url().includes('/api/users/') &&
        response.url().includes('/events') &&
        response.request().method() === 'GET' &&
        response.status() === 200
    );

    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
});
Given('I display what it is needed to create an exercise', async ({ page, dashboardPo,exerciseCreatePo, exerciseCardPo, exerciseCurrentPo } : AllFixtures) => {
    await dashboardPo.createNewExercise();
    await exerciseCreatePo.shouldDisplayForm();
    
    // await exerciseCardPo.getExerciseCardTitle('Exercise test 1');

    // const getResponsePromise = page.waitForResponse(response => 
    //     response.url().includes('/api/exercises/') && 
    //     response.request().method() === 'GET' && 
    //     response.status() === 200 
    // );

    // await exerciseCardPo.displayExerciseCard('Exercise test 1');

    // const response = await getResponsePromise;

    // console.log(`URL de la requête API: ${response.url()}`);
    // console.log(`Méthode de la requête: ${response.request().method()}`);
    // console.log(`Statut de la réponse: ${response.status()}`);

    // await exerciseCurrentPo.shouldBeDisplayed();
});

// Participate to an exercise
When('I click to take my turn', async ({ exerciseCreatePo, exerciseCurrentPo,exquisiteCorpsePo } : AllFixtures) => {
    await exerciseCreatePo.createdAs('Exercise test 1', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
    await exerciseCurrentPo.shouldBeDisplayed();
    await exquisiteCorpsePo.shouldBeDisplayed();
    await exquisiteCorpsePo.takePartToExercise();
    // await exquisiteCorpsePo.shouldDisplayTextEditor();
});
Then('I can fill with content and submit it', async ({ page, exquisiteCorpsePo }: AllFixtures) => {
    await exquisiteCorpsePo.filledWith('My turn has come');

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.submitText();
});

// Cancel my turn to an exercise
When('It is my turn', async ({  page, exerciseCreatePo, exerciseCurrentPo, exquisiteCorpsePo } : AllFixtures) => { 
    await exerciseCreatePo.createdAs('Exercise test 2', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
    await exerciseCurrentPo.shouldBeDisplayed();
    await exquisiteCorpsePo.shouldBeDisplayed();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.takePartToExercise();
});
Then('I click to cancel my turn', async ({ page, exquisiteCorpsePo } : AllFixtures) => {
    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.giveUpTurn();
});

// End an exercise
When('I click to end an exercise', async ({ page, exerciseCreatePo, confirmDialogPo, exerciseCurrentPo } : AllFixtures) => {
    await exerciseCreatePo.createdAs('Exercise test 3', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
    await exerciseCurrentPo.shouldBeDisplayed();
    await exerciseCurrentPo.finishExerciseAction();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await confirmDialogPo.confirmDeleteAction();
});
Then('Redirect to the dashboard page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});

// Delete an exercise
When('I click to delete an exercise', async ({  page, exerciseCreatePo,exerciseCurrentPo, confirmDialogPo } : AllFixtures) => {
    await exerciseCreatePo.createdAs('Exercise test 4', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
    await exerciseCurrentPo.shouldBeDisplayed();
    await exerciseCurrentPo.deleteExerciseAction();
    
    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.request().method() === 'DELETE' && 
        response.status() === 204 
    );

    await confirmDialogPo.confirmDeleteAction();
});
Then('Display the dashboard page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});
