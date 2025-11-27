import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am connected', async ({ loginPo }: AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
});

Given('Dashboard page should be displayed', async ({ dashboardPo }: AllFixtures) => {
    // console.log('✅ Dashboard is displayed');
    await dashboardPo.shouldBeDisplayed();
});

When('I click to Create a new exercise', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.createNewExercise();
});

Then('Display the new exercise form', async ({ exerciseCreatePo }: AllFixtures) => {
    await exerciseCreatePo.shouldDisplayForm();
});

When('I click to exercises done toggle', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.displayEndedExercises();
});

Then('Display exercises done on the dashboard', async ({ dashboardPo}: AllFixtures) => {
    await dashboardPo.checkFinishedExercisesIncluded();
});

When('I click the Jouer button for exercise {string}', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.displayCurrentExercise();
});

Then('Display the current exercise clicked on', async ({ exerciseCurrentPo }: AllFixtures) => {
    await exerciseCurrentPo.shouldBeDisplayed();
});

When('I click to Create a new novel', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.createNewNovel();
});

Then('Display the new novel form', async ({ novelCreatePo }: AllFixtures) => {
    await novelCreatePo.shouldDisplayForm();
});
Given('As a connected user I click to display finished exercises', async ({ dashboardPo } : AllFixtures) => {
    await dashboardPo.displayEndedExercises();
    await dashboardPo.checkFinishedExercisesIncluded();
});
When('I click on a finished exercise card', async ({ exerciseCardPo } : AllFixtures) => {
    await exerciseCardPo.getExerciseCardTitle('Test le cadavre exquis');
    await exerciseCardPo.displayExerciseCard('Test le cadavre exquis');
});

Then('Display the finisehd corresponding exercise', async ({ exerciseCurrentPo }: AllFixtures) => {
    await exerciseCurrentPo.shouldBeDisplayed();
})