import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am on the owl-writey homepage', async ({ page, homePo }: AllFixtures) => {
    await homePo.goTo(); 
});

// Exercise process
When ('I log as a known user for creating an exercise', async ({ page, loginPo, dashboardPo, exerciseCreatePo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');

    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.createNewExercise();

    await exerciseCreatePo.createdAs(
        'Test d\'exercice owl-writey', 
        '4', 
        '5 minutes', 
        '4', '5', 
        'Ceci est un test pour valider ou non le bon fonctionnement du formulaire'
    );
});
Then('I can try to take a turn on it, submit, cancel my turn, finish the exercise', async ({ page, exerciseCurrentPo, exquisiteCorpsePo, confirmDialogPo } : AllFixtures) => {
    await exerciseCurrentPo.shouldBeDisplayed();

    await exquisiteCorpsePo.shouldBeDisplayed();
    await exquisiteCorpsePo.takePartToExercise();
    await exquisiteCorpsePo.filledWith('Mon tour est arrivé');
    await exquisiteCorpsePo.submitText();
    await exquisiteCorpsePo.takePartToExercise();
    await exquisiteCorpsePo.giveUpTurn();

    await exerciseCurrentPo.finishExerciseAction();

    await confirmDialogPo.confirmDeleteAction();
});
Then('I finally delete the exercise', async ({ page, exerciseCurrentPo, confirmDialogPo, dashboardPo, exerciseCardPo } : AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.displayEndedExercises();

    await exerciseCardPo.getExerciseCardTitle('Test d\'exercice owl-writey');
    await exerciseCardPo.displayExerciseCard('Test d\'exercice owl-writey');

    await exerciseCurrentPo.shouldBeDisplayed();
    await exerciseCurrentPo.deleteExerciseAction();

    await confirmDialogPo.confirmDeleteAction();

    await dashboardPo.shouldBeDisplayed();
});

// Novel process
When('I register as a new user', async ({ page, registerPo, dashboardPo } : AllFixtures) => {
    await registerPo.goTo();
    await registerPo.shouldBeDisplayed();
    await registerPo.registerAs('Edward', 'owl-25@hemit.fr', 'password', 'password');

    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.createNewNovel();
});
Then('I can create, update a novel', async ({ page, novelCreatePo, novelCurrentPo, novelHeaderPo } : AllFixtures) => {
    await novelCreatePo.shouldDisplayForm();
    await novelCreatePo.createNovel('Novel test 1');

    await novelCurrentPo.shouldBeDisplayed();

    await novelHeaderPo.updateInfo();

    await novelCreatePo.updateNovel('Updated novel');
});
Then('I can delete the current novel', async ({ page, novelHeaderPo, novelCreatePo, confirmDialogPo } : AllFixtures) => {
    await novelHeaderPo.updateInfo();

    await novelCreatePo.deleteNovel();
    
    await confirmDialogPo.filledAs('Updated novel');
    await confirmDialogPo.confirmDeleteAction();
});