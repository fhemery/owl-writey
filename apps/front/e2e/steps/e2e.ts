import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am on the owl-writey homepage', async ({ page, homePo }: AllFixtures) => {
    const getConfigResponse = page.waitForResponse(response => 
        response.url().includes('/api/config') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );

    await homePo.goTo(); 

    const configResponse = await getConfigResponse;

    console.log(`URL de la requête API: ${configResponse.url()}`);
    console.log(`Méthode de la requête: ${configResponse.request().method()}`);
    console.log(`Statut de la réponse: ${configResponse.status()}`);
});

When ('I log as a known user for creating an exercise', async ({ page, loginPo, dashboardPo, exerciseCreatePo } : AllFixtures) => {
    await loginPo.goTo();

    const getUsersResponse = page.waitForResponse(response => 
        response.url().includes('/api/users/') && 
        !response.url().includes('/events') &&
        response.request().method() === 'GET' && 
        response.status() === 200 
    );

    const getUsersEventsResponse = page.waitForResponse(response =>
        response.url().includes('/api/users/') &&
        response.url().includes('/events') &&
        response.request().method() === 'GET' &&
        response.status() === 200
    );
    await loginPo.logAs('bob@hemit.fr', 'Test123!');

    const userResponse = await getUsersResponse;
    const eventsResponse = await getUsersEventsResponse;

    console.log(`URL de la requête API: ${userResponse.url()}`);
    console.log(`Méthode de la requête: ${userResponse.request().method()}`);
    console.log(`Statut de la réponse: ${userResponse.status()}`);
    
    console.log(`URL de la requête API: ${eventsResponse.url()}`);
    console.log(`Méthode de la requête: ${eventsResponse.request().method()}`);
    console.log(`Statut de la réponse: ${eventsResponse.status()}`);

    const getExercisesDisplayResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );
    await dashboardPo.shouldBeDisplayed();

    const exercisesDisplayResponse = await getExercisesDisplayResponse;

    console.log(`URL de la requête API: ${exercisesDisplayResponse.url()}`);
    console.log(`Méthode de la requête: ${exercisesDisplayResponse.request().method()}`);
    console.log(`Statut de la réponse: ${exercisesDisplayResponse.status()}`);

    await dashboardPo.createNewExercise();

    const getCreateExerciseResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises') && 
        response.request().method() === 'POST' && 
        response.status() === 201
    );
    await exerciseCreatePo.createdAs('Test d\'exercice owl-writey', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');

    const exerciseCreationResponse = await getCreateExerciseResponse;

    console.log(`URL de la requête API: ${exerciseCreationResponse.url()}`);
    console.log(`Méthode de la requête: ${exerciseCreationResponse.request().method()}`);
    console.log(`Statut de la réponse: ${exerciseCreationResponse.status()}`);
});
Then('I can try to take a turn on it, submit, cancel my turn', async ({ page, exerciseCurrentPo, exquisiteCorpsePo } : AllFixtures) => {
    const getExerciseDisplayedResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );
    await exerciseCurrentPo.shouldBeDisplayed();

    const displayedExerciseresponse = await getExerciseDisplayedResponse;

    console.log(`URL de la requête API: ${displayedExerciseresponse.url()}`);
    console.log(`Méthode de la requête: ${displayedExerciseresponse.request().method()}`);
    console.log(`Statut de la réponse: ${displayedExerciseresponse.status()}`);

    const getTakeTurnResponse = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.url().includes('/take-turn') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );
    await exquisiteCorpsePo.takePartToExercise();

    const takeTurnResponse = await getTakeTurnResponse;

    console.log(`URL de la requête API: ${takeTurnResponse.url()}`);
    console.log(`Méthode de la requête: ${takeTurnResponse.request().method()}`);
    console.log(`Statut de la réponse: ${takeTurnResponse.status()}`);

    await exquisiteCorpsePo.filledWith('Mon tour est arrivé');

    const getSubmitTurnResponse = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.url().includes('/submit-turn') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.submitText();

    const submittedResponse = await getSubmitTurnResponse;

    console.log(`URL de la requête API: ${submittedResponse.url()}`);
    console.log(`Méthode de la requête: ${submittedResponse.request().method()}`);
    console.log(`Statut de la réponse: ${submittedResponse.status()}`);

    await exquisiteCorpsePo.takePartToExercise();

     const getCancelTurnResponse = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.url().includes('/cancel-turn') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.giveUpTurn();

    const cancelledResponse = await getCancelTurnResponse;

    console.log(`URL de la requête API: ${cancelledResponse.url()}`);
    console.log(`Méthode de la requête: ${cancelledResponse.request().method()}`);
    console.log(`Statut de la réponse: ${cancelledResponse.status()}`);
});
Then('I finally delete the exercise', async ({ page, exerciseCurrentPo, confirmDialogPo, dashboardPo } : AllFixtures) => {
    await exerciseCurrentPo.deleteExerciseAction();

    const getExerciseDeleteResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.request().method() === 'DELETE' && 
        response.status() === 204 
    );

    await confirmDialogPo.confirmDeleteAction();

    const deltedResponse = await getExerciseDeleteResponse;

    console.log(`URL de la requête API: ${deltedResponse.url()}`);
    console.log(`Méthode de la requête: ${deltedResponse.request().method()}`);
    console.log(`Statut de la réponse: ${deltedResponse.status()}`);

    await dashboardPo.shouldBeDisplayed();
});