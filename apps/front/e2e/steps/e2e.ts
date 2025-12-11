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
});

// Exercise process
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

    const getExercisesDisplayResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );
    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.createNewExercise();

    const getCreateExerciseResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises') && 
        response.request().method() === 'POST' && 
        response.status() === 201
    );
    await exerciseCreatePo.createdAs('Test d\'exercice owl-writey', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
});
Then('I can try to take a turn on it, submit, cancel my turn, finish the exercise', async ({ page, exerciseCurrentPo, exquisiteCorpsePo, confirmDialogPo } : AllFixtures) => {
    const getExerciseDisplayedResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );
    await exerciseCurrentPo.shouldBeDisplayed();
    await exquisiteCorpsePo.shouldBeDisplayed();

    const getTakeTurnResponse = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.url().includes('/take-turn') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );
    await exquisiteCorpsePo.takePartToExercise();
    await exquisiteCorpsePo.filledWith('Mon tour est arrivé');

    const getSubmitTurnResponse = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.url().includes('/submit-turn') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.submitText();
    await exquisiteCorpsePo.takePartToExercise();

    const getCancelTurnResponse = page.waitForResponse(response => 
        response.url().includes('/api/exquisite-corpse/') && 
        response.url().includes('/cancel-turn') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await exquisiteCorpsePo.giveUpTurn();
    await exerciseCurrentPo.finishExerciseAction();

    const getFinishExerciseResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.url().includes('/finish') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await confirmDialogPo.confirmDeleteAction();
});
Then('I finally delete the exercise', async ({ page, exerciseCurrentPo, confirmDialogPo, dashboardPo, exerciseCardPo } : AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.displayEndedExercises();
    await exerciseCardPo.getExerciseCardTitle('Test d\'exercice owl-writey');

    const getExercisesEventsResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.url().includes('/events') &&
        response.request().method() === 'GET' && 
        response.status() === 200 
    );

    await exerciseCardPo.displayExerciseCard('Test d\'exercice owl-writey');
    await exerciseCurrentPo.shouldBeDisplayed();
    await exerciseCurrentPo.deleteExerciseAction();

    const getExerciseDeleteResponse = page.waitForResponse(response => 
        response.url().includes('/api/exercises/') && 
        response.request().method() === 'DELETE' && 
        response.status() === 204 
    );

    await confirmDialogPo.confirmDeleteAction();
    await dashboardPo.shouldBeDisplayed();
});

// Novel process
When('I register as a new user', async ({ page, registerPo, dashboardPo } : AllFixtures) => {
    await registerPo.goTo();

    const apiResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/users') && 
        response.request().method() === 'POST' && 
        response.status() === 201
    );
    const logResponse= page.waitForResponse(response => 
        response.url().includes('/api/log') && 
        response.request().method() === 'POST' && 
        response.status() === 204
    );
    await registerPo.registerAs('Edward', 'owl-30@hemit.fr', 'password', 'password');

    const getNovelsDsiplayResponse= page.waitForResponse(response => 
        response.url().includes('/api/novels') && 
        response.request().method() === 'GET' && 
        response.status() === 200
    );
    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.createNewNovel();
});
Then('I can create, update a novel', async ({ page, novelCreatePo, novelCurrentPo, novelHeaderPo } : AllFixtures) => {
    await novelCreatePo.shouldDisplayForm();

    const createNovelResponse = page.waitForResponse(response => 
        response.url().includes('/api/novels') && 
        response.request().method() === 'POST' && 
        response.status() === 201
    );
    await novelCreatePo.createNovel('This novel is a test');

    const getCurrentNovelDisplayResponse = page.waitForResponse(response => 
        response.url().includes('/api/novels') && 
        response.request().method() === 'GET' && 
        response.status() === 200
    );
    await novelCurrentPo.shouldBeDisplayed();
    await novelHeaderPo.updateInfo();

    const updateNovelInfoResponse = page.waitForResponse(response => 
        response.url().includes('/api/novels/') && 
        response.url().includes('/events') &&
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await novelCreatePo.updateNovel('This is an amazing story');
});
Then('I can delete the current novel', async ({ page, novelHeaderPo, novelCreatePo, confirmDialogPo } : AllFixtures) => {
    await novelHeaderPo.updateInfo();
    await novelCreatePo.deleteNovel();

    const deleteNovelReponse = page.waitForResponse(response => 
        response.url().includes('/api/novels/') && 
        response.request().method() === 'DELETE' && 
        response.status() === 204 
    );

    await confirmDialogPo.filledAs('This is an amazing story');
    await confirmDialogPo.confirmDeleteAction();
});