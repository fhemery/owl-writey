import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am logged as a user', async ({ page, loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
});
Given('I display what it is needed to create an exercise', async ({ page, dashboardPo,exerciseCreatePo, exerciseCardPo, exerciseCurrentPo } : AllFixtures) => {
    await dashboardPo.createNewExercise();
    await exerciseCreatePo.shouldDisplayForm();
    
    // await exerciseCardPo.getExerciseCardTitle('Exercise test 1');
    // await exerciseCardPo.displayExerciseCard('Exercise test 1');
    // await exerciseCurrentPo.shouldBeDisplayed();
});

// Participate to an exercise
When('I click to take my turn', async ({ exerciseCreatePo, exerciseCurrentPo,exquisiteCorpsePo } : AllFixtures) => {
    await exerciseCreatePo.createdAs(
        'Exercise test 1', 
        '4', 
        '5 minutes', 
        '4', 
        '5', 
        'Ceci est un test pour valider ou non le bon fonctionnement du formulaire'
    );
    await exerciseCurrentPo.shouldBeDisplayed();
    await exquisiteCorpsePo.shouldBeDisplayed();
    await exquisiteCorpsePo.takePartToExercise();
    // await exquisiteCorpsePo.shouldDisplayTextEditor();
});
Then('I can fill with content and submit it', async ({ page, exquisiteCorpsePo }: AllFixtures) => {
    await exquisiteCorpsePo.filledWith('Mon tour est arrivé');
    await exquisiteCorpsePo.submitText();
});

// Cancel my turn to an exercise
When('It is my turn', async ({  page, exerciseCreatePo, exerciseCurrentPo, exquisiteCorpsePo } : AllFixtures) => { 
    await exerciseCreatePo.createdAs(
        'Exercise test 2', 
        '4', 
        '5 minutes', 
        '4', 
        '5', 
        'Ceci est un test pour valider ou non le bon fonctionnement du formulaire'
    );
    await exerciseCurrentPo.shouldBeDisplayed();
    await exquisiteCorpsePo.shouldBeDisplayed();
    await exquisiteCorpsePo.takePartToExercise();
});
Then('I click to cancel my turn', async ({ page, exquisiteCorpsePo } : AllFixtures) => {
    await exquisiteCorpsePo.giveUpTurn();
});

// End an exercise
When('I click to end an exercise', async ({ page, exerciseCreatePo, confirmDialogPo, exerciseCurrentPo } : AllFixtures) => {
    await exerciseCreatePo.createdAs(
        'Exercise test 3', 
        '4', 
        '5 minutes', 
        '4', 
        '5', 
        'Ceci est un test pour valider ou non le bon fonctionnement du formulaire'
    );
    await exerciseCurrentPo.shouldBeDisplayed();
    await exerciseCurrentPo.finishExerciseAction();
    await confirmDialogPo.confirmDeleteAction();
});
Then('Redirect to the dashboard page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});

// Delete an exercise
When('I click to delete an exercise', async ({  page, exerciseCreatePo,exerciseCurrentPo, confirmDialogPo } : AllFixtures) => {
    await exerciseCreatePo.createdAs(
        'Exercise test 4', 
        '4', 
        '5 minutes', 
        '4', 
        '5', 
        'Ceci est un test pour valider ou non le bon fonctionnement du formulaire'
    );
    await exerciseCurrentPo.shouldBeDisplayed();
    await exerciseCurrentPo.deleteExerciseAction();
    await confirmDialogPo.confirmDeleteAction();
});
Then('Display the dashboard page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});
